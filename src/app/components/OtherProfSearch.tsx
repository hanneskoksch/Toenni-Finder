"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface OtherProfSearchProps {
  onSearch: (profName: string) => void;
}
function OtherProfSearch({ onSearch }: OtherProfSearchProps) {
  const [profName, setProfName] = useState("");

  return (
    <>
      <div>
        <label
          htmlFor="profName"
          className="block text-sm/6 font-medium text-gray-900 mb-3"
        >
          Looking for another Prof.?
        </label>
        <div className="flex space-x-3">
          <div className="relative rounded-md shadow-sm ">
            <input
              id="profName"
              name="profName"
              type="text"
              placeholder="Name of Prof."
              onChange={(e) => setProfName(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            />
          </div>
          <Button
            variant="secondary"
            onClick={
              profName !== ""
                ? () => {
                    onSearch(profName.trim());
                  }
                : undefined
            }
          >
            Search
          </Button>
        </div>
      </div>
    </>
  );
}

export default OtherProfSearch;
