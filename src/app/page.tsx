"use client";

import { useEffect, useState } from "react";
import Finder from "./components/Finder";
import OtherProfSearch from "./components/OtherProfSearch";
import { Separator } from "@/components/ui/separator";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { getAllEventsCached, StarplanEvent } from "./components/parse-ical";
import Footer from "./components/Footer";

export default function Home() {
  const [profName, setProfName] = useQueryState(
    "Prof",
    parseAsString.withDefault("Toenni"),
  );
  const [weeksToCheck] = useQueryState("weeks", parseAsInteger.withDefault(1));

  const [starPlanData, setStarPlanData] = useState<StarplanEvent[] | null>(
    null,
  );
  const [dateFetchedAt, setDateFetchedAt] = useState<string | null>(null);

  // initial data fetch
  useEffect(() => {
    // reset data to show loading state when weeksToCheck change
    setStarPlanData(null);
    setDateFetchedAt(null);

    // fetch data from server
    const fetchStarPlanData = async () => {
      const data = await getAllEventsCached(weeksToCheck);
      setStarPlanData(data.allEvents);
      setDateFetchedAt(data.fetchedAt);
    };
    fetchStarPlanData();
  }, [weeksToCheck]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 mb-10">
      <h1 className="text-center text-transparent bg-clip-text font-extrabold text-6xl py-8 bg-linear-to-br from-zinc-300 to-zinc-800">
        {profName}-Finder
      </h1>
      <p className="text-center pb-12">
        A tool for all people who are struggling to find their dearest and
        beloved prof who rarely reads his emails... ❤️
      </p>
      <Finder starPlanData={starPlanData} profName={profName} />
      <Separator className="my-8 max-w-(--breakpoint-sm)" />
      <OtherProfSearch
        onSearch={(query: string) => {
          setProfName(query);
        }}
      />
      <Footer dataFetchedAt={dateFetchedAt} />
    </main>
  );
}
