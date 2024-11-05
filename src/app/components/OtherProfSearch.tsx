"use client";

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
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
              value={profName}
              onChange={(e) => setProfName(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pr-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            />
            {profName !== "" && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => {
                  setProfName("");
                  document.getElementById("profName")?.focus();
                }}
              >
                <XIcon className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
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
