import * as cheerio from "cheerio";

const semesterKeys = [
  "MI7-1",
  "MI7-2",
  "MI7-3",
  "MI7-3-Wahl",
  "MI7-4",
  "MI7-4-Wahl",
  "MI7-6",
  "MI7-6-Wahl",
  "MI7-7",
  "MI7-7-Wahl",
  "CS3-1-Wahl",
];

function getDate(): string {
  return new Date().toISOString().split("T")[0];
}

async function getStarplanData() {
  let results = [];
  const today: string = getDate();

  for (const key of semesterKeys) {
    const response = await fetch(
      `https://splan.hdm-stuttgart.de/splan/json?m=getTT&sel=pg&pu=34&og=73&pg=${key}&sd=true&dfc=${today}&loc=1&sa=false&cb=o`,
      { next: { revalidate: 3600 } } // chache result for 1h
    );
    if (response && response.body && response.status === 200) {
      results.push(await response.text());
    }
  }
  return results;
}

interface Event {
  profName: string;
  roomId: string;
  timeSlot: string;
  courseName: string;
  horstLink: string;
  semester: string;
  splanLink: string;
}

function getWeekdaysPixelArray(htmlData: string): number[] {
  const weekdaysPixels: number[] = [];

  const $ = cheerio.load(htmlData);
  const weekdays = $(".ttweekdaycell");

  weekdays.each((index, element) => {
    const style = $(element).attr("style");
    if (style) {
      const pixel = getLeftStyleValue(style) - 1;
      weekdaysPixels.push(pixel);
    }
  });
  return weekdaysPixels;
}

function getLeftStyleValue(style: string): number {
  return parseInt(style.slice(style.indexOf("left:") + "left:".length, -3));
}

export async function parseStarplanData(): Promise<Event[][]> {
  const result: Event[][] = [];

  const starPlanData = await getStarplanData();

  // iterate over all semesters
  starPlanData.forEach((semesterData, semesterNumber) => {
    const $ = cheerio.load(semesterData);

    // get displayed days
    const days = $("#ttxline");
    // get width of each displayed date
    const weekdaysPixels = getWeekdaysPixelArray(days.toString());

    // iterate over all events within the semester
    $(".ttevent").each((_, element) => {
      // get style to later determine the weekday
      const style = $(element).attr("style");
      for (let i = 0; i < weekdaysPixels.length; i++) {
        const tooltipText = $(element).find(".tooltip").text();
        // check if event is relevant
        if (tooltipText.includes("Dr. Fridtjof Toenniessen") && style) {
          // check if event is on the current weekday (index of iteration)
          const styleLeft = getLeftStyleValue(style);
          if (
            styleLeft >= weekdaysPixels[i] &&
            styleLeft < weekdaysPixels[i + 1]
          ) {
            let eventAsArray = $(element)
              .find(".tooltip")
              .html()
              ?.toString()
              .split("<br>");
            eventAsArray?.pop();
            // remove "Verlegung" properties
            eventAsArray = eventAsArray?.filter(
              (value) => !(value.startsWith("<span") || value == "Verlegung")
            );

            console.log(eventAsArray);
            const semester = semesterKeys[semesterNumber];

            const event: Event = {
              courseName: eventAsArray![0],
              profName: eventAsArray![1],
              roomId: eventAsArray![3],
              timeSlot: eventAsArray![4],
              horstLink: `https://horst.hdm-stuttgart.de/${
                eventAsArray![3].split(/[ ,]/)[0]
              }`,
              semester: semester,
              splanLink: `https://splan.hdm-stuttgart.de/splan/mobile?lan=de&acc=true&act=tt&sel=pg&pu=34&og=73&pg=${semester}&sd=true&dfc=${getDate()}&loc=1&sa=false&cb=o`,
            };
            if (result[i]) {
              if (!eventAlreadyExists(event, result[i])) {
                result[i].push(event);
              }
            } else {
              result[i] = [event];
            }
            // result[i] = result[i] ? [...result[i], event] : [event];
          }
        }
      }
    });
  });
  return result;
}

function eventAlreadyExists(event: Event, list: Event[]): boolean {
  return list.some(
    (e) =>
      e.courseName === event.courseName &&
      e.roomId === event.roomId &&
      e.timeSlot === event.timeSlot
  );
}
