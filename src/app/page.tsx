"use client";

import Finder from "./components/Finder";
import { Suspense, useState } from "react";
import { LoaderCircle } from "lucide-react";
import OtherProfSearch from "./components/other-prof-search";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [profName, setProfName] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <h1 className="text-center text-transparent bg-clip-text font-extrabold text-6xl py-8 bg-gradient-to-br from-zinc-300 to-zinc-800">
        Toenni-Finder
      </h1>
      <p className="text-center pb-12">
        A tool for all people who are struggling to find their dearest and
        beloved Prof. ❤️
      </p>
      <Suspense
        fallback={
          <div className="flex space-x-3 text-zinc-600 mt-10">
            <LoaderCircle className="animate-spin" />
            <p>Looking for Toenni...</p>
          </div>
        }
      >
        <Finder profName={profName} />
      </Suspense>
      <Separator className="my-8" />
      <OtherProfSearch onSearch={setProfName} />
    </main>
  );
}
