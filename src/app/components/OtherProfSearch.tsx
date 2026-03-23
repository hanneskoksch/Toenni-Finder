"use client";

import Autocomplete from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useId, useState } from "react";

interface OtherProfSearchProps {
  onSearch: (profName: string) => void;
  profList?: string[];
  profSearchInputRef: React.RefObject<HTMLInputElement | null>;
}
function OtherProfSearch({
  onSearch,
  profList,
  profSearchInputRef,
}: OtherProfSearchProps) {
  const [profName, setProfName] = useState("");

  const handleSearch = () => {
    if (profName !== "") {
      onSearch(profName.trim());
      window.scrollTo(0, 0);

      // unfocus input after search
      if (profSearchInputRef.current) {
        profSearchInputRef.current.blur();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const id = useId();

  const handleClearInput = () => {
    setProfName("");

    if (profSearchInputRef.current) {
      profSearchInputRef.current.focus();
    }
  };

  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm/6 font-medium text-gray-900 mb-3"
      >
        Looking for another prof?
      </label>

      <div className="flex gap-2">
        <div className="relative">
          <Autocomplete
            allSuggestions={profList ?? []}
            placeholder="Name of prof"
            ref={profSearchInputRef}
            id={id}
            value={profName}
            onChange={(value) => setProfName(value)}
            onKeyDown={handleKeyDown}
          />
          {profName && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearInput}
              className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Clear input</span>
            </Button>
          )}
        </div>
        <Button
          variant="default"
          onClick={handleSearch}
          disabled={profName.trim() === ""}
        >
          Search
        </Button>
      </div>
    </>
  );
}

export default OtherProfSearch;
