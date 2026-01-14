"use server";

import ICAL from "ical.js";
import { unstable_cache } from "next/cache";

export interface StarplanEvent {
  courseName: string;
  profName: string;
  roomId: string;

  dateStart: Date;
  dateEnd: Date;

  horstLink: string;
  semester: string;
  splanLink: string;
}

/**
 * Find out, for which semesters the schedule is offered and return their ids.
 */
async function getOfferedSemesterIds(): Promise<number[]> {
  const response = await fetch(
    "https://splan.hdm-stuttgart.de/splan/json?m=getpus",
  );
  const data = await response.json();
  return data[0].map((semester: any) => {
    return semester.id;
  });
}

/**
 * Find out the semester number (e.g. MI-1, MI-2, MI-3, MI-3-Wahl, ...) ids
 * for the relevant study programs
 */
async function getSemesterNumberIds(
  semesterId: number,
): Promise<{ id: number; studyProgramId: number }[]> {
  const semesterNumberIds: { id: number; studyProgramId: number }[] = [];

  const relevantStudyProgramIds = [
    73, // MI7
    78, // MMB7
    83, // CS3
  ];

  for (const studyProgramId of relevantStudyProgramIds) {
    const response = await fetch(
      `https://splan.hdm-stuttgart.de/splan/json?m=getPgsExt&pu=${semesterId}&og=${studyProgramId}`,
    );
    const data = await response.json();

    data[0].map((semesterNumber: any) => {
      semesterNumberIds.push({
        id: semesterNumber.id,
        studyProgramId: studyProgramId,
      });
    });
  }
  return semesterNumberIds;
}

async function getIcal(
  semesterId: number,
  semesterNumberId: number,
): Promise<string> {
  const response = await fetch(
    `https://splan.hdm-stuttgart.de/splan/ical?lan=de&puid=${semesterId}&type=pg&pgid=${semesterNumberId}`,
  );
  const data = await response.text();
  return data;
}

function parseIcal(
  ical: string,
  studyProgramId: number,
  semesterId: number,
): StarplanEvent[] {
  const jcalData = ICAL.parse(ical);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");
  const allEvents: StarplanEvent[] = [];
  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);
    allEvents.push(parseVevent(event, studyProgramId, semesterId));
  }
  return allEvents;
}

function parseVevent(
  vevent: ICAL.Event,
  studyProgramId: number,
  semesterId: number,
): StarplanEvent {
  // Format: course \n prof \n semester
  const description = vevent.description;
  let descriptionArray = description.split("\n");
  descriptionArray = descriptionArray.filter((value) => value !== "Verlegung");
  // const description = vevents[0].jCal[1][6][3];

  const dateStart = vevent.startDate;
  // const dateStart = vevents[0].jCal[1][1][3];

  const dateEnd = vevent.endDate;
  // const dateEnd = vevents[0].jCal[1][2][3];

  const location = vevent.location;
  // const location = vevents[0].jCal[1][5][3];

  // Only use one room
  let horstLocationName = location.split(",")[0];
  horstLocationName = horstLocationName.split(" ")[0];

  const semester = descriptionArray[2];

  const horstLinkDate = new Date().toISOString().split("T")[0];

  return {
    courseName: descriptionArray[0],
    profName: descriptionArray[1],
    roomId: location,
    dateStart: dateStart.toJSDate(),
    dateEnd: dateEnd.toJSDate(),
    horstLink: `https://horst.hdm-stuttgart.de/${horstLocationName}`,
    semester: semester,
    splanLink: `https://splan.hdm-stuttgart.de/splan/mobile?lan=de&acc=true&act=tt&sel=pg&pu=${semesterId}&og=${studyProgramId}&pg=${semester}&sd=true&dfc=${horstLinkDate}&loc=1&sa=false&cb=o`,
  };
}

function secondsUntilNextMidnight() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);

  return Math.floor((nextMidnight.getTime() - now.getTime()) / 1000);
}

const getAllEventsCached = unstable_cache(
  async (weeks: number) => {
    return await getAllEvents(weeks);
  },
  ["all-events"], // cache key prefix
  {
    revalidate: secondsUntilNextMidnight(),
  },
);

async function getAllEvents(weeks: number): Promise<StarplanEvent[]> {
  const allEvents: StarplanEvent[] = [];
  const semesterIds = await getOfferedSemesterIds();

  for (const semesterId of semesterIds) {
    const semesterNumberIds = await getSemesterNumberIds(semesterId);

    for (const semesterNumberId of semesterNumberIds) {
      const ical = await getIcal(semesterId, semesterNumberId.id);
      const newEvents = parseIcal(
        ical,
        semesterNumberId.studyProgramId,
        semesterId,
      );
      for (const newEvent of newEvents) {
        if (
          !allEvents.some(
            (event) =>
              event.courseName === newEvent.courseName &&
              event.dateStart.valueOf() === newEvent.dateStart.valueOf(),
          )
        ) {
          allEvents.push(newEvent);
        }
      }
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayInNWeeks = new Date(
    today.getTime() + weeks * 7 * 24 * 60 * 60 * 1000,
  );
  todayInNWeeks.setHours(24, 0, 0, 0);

  const filteredEvents = allEvents.filter((event) => {
    return (
      // event.profName.includes("Toenniessen") && // filtering was moved to client component
      event.dateStart >= today && event.dateStart <= todayInNWeeks
    );
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    return a.dateStart.valueOf() - b.dateStart.valueOf();
  });

  return sortedEvents;
}

export { getAllEventsCached };
