"use client";

import Finder from "./components/Finder";
import OtherProfSearch from "./components/OtherProfSearch";
import { Separator } from "@/components/ui/separator";
import { parseAsString, useQueryState } from "nuqs";

export default function Home() {
  const [profName, setProfName] = useQueryState(
    "Prof",
    parseAsString.withDefault("Toenni"),
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 mb-10">
      <h1 className="text-center text-transparent bg-clip-text font-extrabold text-6xl py-8 bg-linear-to-br from-zinc-300 to-zinc-800">
        {profName}-Finder
      </h1>
      <p className="text-center pb-12">
        A tool for all people who are struggling to find their dearest and
        beloved Prof. ❤️
      </p>
      <Finder profName={profName} />
      <Separator className="my-8 max-w-(--breakpoint-sm)" />
      <OtherProfSearch
        onSearch={(query: string) => {
          setProfName(query);
        }}
      />
    </main>
  );
}
