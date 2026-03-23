"use client";

import { useState, RefObject } from "react";
import { Input } from "@/components/ui/input";

interface AutoCompleteProps {
  value?: string;
  allSuggestions: string[];
  placeholder?: string;
  ref?: RefObject<HTMLInputElement | null>;
  id?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (value: string) => void;
}

export default function Autocomplete({
  value = "",
  allSuggestions,
  placeholder,
  ref,
  id,
  onChange,
  onKeyDown,
}: AutoCompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions =
    isFocused && value?.trim()
      ? allSuggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase()),
        )
      : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // setQuery(newValue);
    onChange?.(newValue);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      onChange?.(suggestions[selectedIndex]);
      setSelectedIndex(-1);
    } else if (e.key === "Escape") {
      setSelectedIndex(-1);
    } else {
      onKeyDown?.(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange?.(suggestion);
    setSelectedIndex(-1);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events on suggestions
    setTimeout(() => {
      setIsFocused(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pr-10"
          aria-label="Search input"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={suggestions.length > 0}
        />
      </div>
      {suggestions.length > 0 && isFocused && (
        <ul
          id="suggestions-list"
          className="mt-2 bg-background border rounded-md shadow-sm absolute z-10"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                index === selectedIndex ? "bg-muted" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
