"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function DatePicker({ stateValue, setStateValue }) {
  // const [date, setDate] = React.useState<Date>();
  console.log("date", stateValue);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          // className={cn(
          //   "w-[100%] justify-start text-left font-normal",
          //   !date && "text-muted-foreground"
          // )}
          className={cn(
            "w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  justify-start text-left font-normal",
            stateValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {stateValue ? format(stateValue, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={stateValue}
          onSelect={setStateValue}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
