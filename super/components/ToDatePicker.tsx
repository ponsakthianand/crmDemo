"use client"

import * as React from "react"
import { format, startOfMonth, isBefore, startOfTomorrow } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"

interface DatePickerProps {
  onSelect: (date: Date) => void
  minDate?: Date
  dateValue?: Date
}

export function ToDatePicker({ onSelect, minDate, dateValue }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()
  const [month, setMonth] = React.useState<Date>(startOfMonth(new Date()))
  const [key, setKey] = React.useState(0)
  const yearListRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    dateValue && setDate(dateValue)
  }, [dateValue])

  const tomorrow = startOfTomorrow()

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear()
    const futureYears = 80
    return Array.from({ length: futureYears + 1 }, (_, i) => currentYear + i)
  }, [])

  const handleYearChange = (year: number) => {
    const newMonth = new Date(month)
    newMonth.setFullYear(year)
    setMonth(newMonth)
    setKey((prevKey) => prevKey + 1)
  }

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
    }
    if (newDate) {
      setMonth(startOfMonth(newDate))
      onSelect(newDate)
    }
  }

  React.useEffect(() => {
    if (yearListRef.current) {
      const selectedYearElement = yearListRef.current.querySelector(`[data-year="${month.getFullYear()}"]`)
      if (selectedYearElement) {
        selectedYearElement.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [month])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[250px] justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="border-r p-2" style={{ width: "80px" }}>
            <div className="text-sm font-medium mb-2 text-center">Year</div>
            <div
              ref={yearListRef}
            // className="h-[300px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              <ScrollArea className="h-[300px]">
                {years.map((year) => (
                  <div
                    key={year}
                    className={cn(
                      "cursor-pointer py-1 px-2 text-center text-sm rounded",
                      year === month.getFullYear() ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      year < tomorrow.getFullYear() && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => year >= tomorrow.getFullYear() && handleYearChange(year)}
                    data-year={year}
                  >
                    {year}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          <div>
            <Calendar
              key={key}
              mode="single"
              selected={date as Date}
              onSelect={(date) => date && handleSelect(date)}
              month={month}
              onMonthChange={setMonth}
              initialFocus
              fromYear={tomorrow.getFullYear()}
              toYear={tomorrow.getFullYear() + 80}
              disabled={(date) => {
                if (minDate) {
                  return isBefore(date, minDate) || isBefore(date, tomorrow)
                }
                return isBefore(date, tomorrow)
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

