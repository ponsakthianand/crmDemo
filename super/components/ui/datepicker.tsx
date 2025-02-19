"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  stateValue: Date | undefined;
  setStateValue: React.Dispatch<React.SetStateAction<Date | undefined>>;
}
export function DatePicker({ stateValue, setStateValue }: DatePickerProps) {
  // const [date, setDate] = React.useState<Date>();

  const parsedDate = moment(stateValue, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
  const formattedDate = parsedDate.format("MMMM Do, YYYY");

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
          {stateValue ? formattedDate : <span>Pick a date</span>}
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
