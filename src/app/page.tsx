import Finder from "./components/Finder";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <h1 className="text-center text-transparent bg-clip-text font-extrabold text-6xl py-8 bg-gradient-to-br from-zinc-300 to-zinc-800">
        Toenni-Finder
      </h1>
      <p className="text-center pb-12">
        A tool for all people who are struggling to find their dearest and
        beloved Prof. ❤️
      </p>
      <Suspense fallback={<p>Finding Toenni...</p>}>
        <Finder />
      </Suspense>
    </main>
  );
}
