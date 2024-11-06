"use client";

import { Button } from "@/components/ui/button";
import { getAllEvents, StarplanEvent } from "./parse-ical";
import { useEffect, useState } from "react";
import { Ban, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FinderProps {
  profName: string;
}

function Finder({ profName }: FinderProps) {
  const [starPlanData, setStarPlanData] = useState<StarplanEvent[] | null>(
    null
  );
  const [filteredStarplanData, setFilteredStarplanData] = useState<
    StarplanEvent[] | null
  >(null);

  // initial data fetch
  useEffect(() => {
    const fetchStarPlanData = async () => {
      const data = await getAllEvents();
      setStarPlanData(data);
    };

    fetchStarPlanData();
  }, []);

  // filter data based on profName
  useEffect(() => {
    if (!starPlanData) return;
    setFilteredStarplanData(
      starPlanData.filter((event) =>
        event.profName.toLowerCase().includes(profName.toLowerCase())
      )
    );
  }, [starPlanData, profName]);

  // loading state
  if (!filteredStarplanData)
    return (
      <div className="flex space-x-3 text-zinc-600 my-16">
        <LoaderCircle className="animate-spin" />
        <p>Looking for {profName}...</p>
      </div>
    );

  // no data found state
  if (filteredStarplanData.length === 0)
    return (
      <Alert className="max-w-screen-sm my-16">
        <Ban className="h-4 w-4" />
        <AlertTitle>{profName} could not be found.</AlertTitle>
        <AlertDescription>
          Try searching for another Prof. or check the spelling.
        </AlertDescription>
      </Alert>
    );

  const hasEventOnDay = (day: Date): boolean => {
    if (!filteredStarplanData) return false;
    return filteredStarplanData.some((event) => {
      return event.dateStart.toDateString() === day.toDateString();
    });
  };

  const weekdays = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];

  const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const dayArray = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  return (
    <>
      {dayArray().map(
        (day, index) =>
          hasEventOnDay(day) && (
            <div className="w-full max-w-screen-sm" key={`day-${index}`}>
              <p className="p-4 bg-gradient-to-r from-zinc-400 to-zinc-300 text-white rounded-lg ">
                {weekdays[day.getDay()]}, {day.toLocaleDateString("de-DE")}
                {isSameDay(new Date(), day) && " (Today)"}
                {isSameDay(
                  new Date(new Date().setDate(new Date().getDate() + 1)),
                  day
                ) && " (Tomorrow)"}
              </p>
              <div className="p-4">
                {filteredStarplanData.map((event, i) => (
                  <div key={`event-${i}`}>
                    {isSameDay(day, event.dateStart) && (
                      <div
                        className="flex justify-between space-x-3 mb-6"
                        key={`event-${i}1`}
                      >
                        <div>
                          <div className="flex space-x-2 items-center">
                            <p className="font-bold">{`${event.dateStart
                              .toLocaleTimeString("de-DE")
                              .substring(0, 5)} - ${event.dateEnd
                              .toLocaleTimeString("de-DE")
                              .substring(0, 5)}`}</p>
                            <p className="px-1 border-zinc-200 border-2 rounded-lg bg-zinc-50 text-xs">
                              {event.roomId}
                            </p>
                          </div>
                          <p className="text-sm">{event.courseName}</p>
                          <a
                            target="_blank"
                            href={event.splanLink}
                            className="text-zinc-500"
                          >
                            <p className="text-sm">{event.semester}</p>
                          </a>
                        </div>
                        <div className="flex flex-col">
                          <Button variant="ghost" asChild size="sm">
                            <a target="_blank" href={event.horstLink}>
                              📍 Find in Horst
                            </a>
                          </Button>
                          <Button variant="ghost" asChild size="sm">
                            <a target="_blank" href={event.splanLink}>
                              📅 Find in Splan
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </>
  );
}

export default Finder;
