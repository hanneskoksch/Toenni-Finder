"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { useId, useRef, useState } from "react";

interface OtherProfSearchProps {
  onSearch: (profName: string) => void;
}
function OtherProfSearch({ onSearch }: OtherProfSearchProps) {
  const [profName, setProfName] = useState("");

  const handleSearch = () => {
    if (profName !== "") {
      onSearch(profName.trim());
      window.scrollTo(0, 0);

      // unfocus input after search
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const handleClearInput = () => {
    setProfName("");

    if (inputRef.current) {
      inputRef.current.focus();
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
          <Input
            name="profName"
            placeholder="Name of Prof."
            ref={inputRef}
            id={id}
            type="text"
            value={profName}
            onChange={(e) => setProfName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-9"
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
