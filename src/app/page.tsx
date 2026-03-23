"use client";

import { useEffect, useRef, useState } from "react";
import Finder from "./components/Finder";
import OtherProfSearch from "./components/OtherProfSearch";
import { Separator } from "@/components/ui/separator";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { getAllEventsCached, StarplanEvent } from "./components/parse-ical";
import Footer from "./components/Footer";

export default function Home() {
  const profSearchInputRef = useRef<HTMLInputElement>(null);
  const [profName, setProfName] = useQueryState(
    "Prof",
    parseAsString.withDefault("Toenni"),
  );
  const [profList, setProfList] = useState<string[]>([]);
  const [weeksToCheck] = useQueryState("weeks", parseAsInteger.withDefault(1));

  const [starPlanData, setStarPlanData] = useState<StarplanEvent[] | null>(
    null,
  );
  const [dateFetchedAt, setDateFetchedAt] = useState<string | null>(null);
  const [loadedWeeks, setLoadedWeeks] = useState<number | null>(null);

  // data fetch for selected week range
  useEffect(() => {
    let isCancelled = false;

    // fetch data from server
    const fetchStarPlanData = async () => {
      const data = await getAllEventsCached(weeksToCheck);
      if (isCancelled) return;

      setStarPlanData(data.allEvents);
      setDateFetchedAt(data.fetchedAt);
      setLoadedWeeks(weeksToCheck);

      // extract prof list
      const profSet = new Set<string>();
      data.allEvents.forEach((event) => {
        event.profName.split(",").forEach((prof) => {
          profSet.add(prof.trim());
        });
      });
      setProfList(Array.from(profSet).sort());
    };
    fetchStarPlanData();

    return () => {
      isCancelled = true;
    };
  }, [weeksToCheck]);

  const isDataForCurrentWeeksLoaded = loadedWeeks === weeksToCheck;
  const displayedStarPlanData = isDataForCurrentWeeksLoaded ? starPlanData : null;
  const displayedDateFetchedAt = isDataForCurrentWeeksLoaded
    ? dateFetchedAt
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 mb-10">
      <h1 className="text-center text-transparent bg-clip-text font-extrabold text-6xl py-8 bg-linear-to-br from-zinc-300 to-zinc-800">
        {profName}-Finder
      </h1>
      <p className="text-center pb-12">
        A tool for all people who are struggling to find their dearest and
        beloved prof who rarely reads his emails... ❤️
      </p>
      <Finder
        starPlanData={displayedStarPlanData}
        profName={profName}
        profSearchInputRef={profSearchInputRef}
      />
      <Separator className="my-8 max-w-(--breakpoint-sm)" />
      <OtherProfSearch
        profSearchInputRef={profSearchInputRef}
        onSearch={(query: string) => {
          setProfName(query);
        }}
        profList={profList}
      />
      <Footer dataFetchedAt={displayedDateFetchedAt} />
    </main>
  );
}
