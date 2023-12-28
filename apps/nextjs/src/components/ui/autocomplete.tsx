import { CheckIcon, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const Autocomplete = ({
  options,
  onSelectOption,
  value,
  searchText,
  setSearchText,
  open,
  setOpen,
  selectionPlaceholder = "",
  searchPlaceholder = "",
  isLoading,
  emptyResultsText,
}: {
  value: string;
  options: { label: string; value: string }[];
  onSelectOption: (val: string) => void;
  searchText: string;
  setSearchText: (val: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  selectionPlaceholder?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  emptyResultsText?: string;
}) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label ??
              selectionPlaceholder
            : selectionPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            value={searchText}
            onValueChange={setSearchText}
            isLoading={isLoading}
          />
          <CommandEmpty>{emptyResultsText ?? "No results found"}</CommandEmpty>
          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onSelectOption(currentValue === value ? "" : currentValue);
                  if (setOpen) {
                    setOpen(false);
                  }
                }}
              >
                {option.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
