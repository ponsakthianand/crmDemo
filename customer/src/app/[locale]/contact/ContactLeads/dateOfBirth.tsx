"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DateOfBirthInputProps {
  value?: string
  onChange: (value: string) => void
}

export function DateOfBirthInput({ value = "", onChange }: DateOfBirthInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined
    const parsedDate = parse(value, "dd-MM-yyyy", new Date())
    return !isNaN(parsedDate.getTime()) ? parsedDate : undefined
  })
  const [month, setMonth] = React.useState<Date>(() => date || new Date())
  const [open, setOpen] = React.useState(false)

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

  const handleYearChange = (year: string) => {
    const newDate = new Date(month)
    newDate.setFullYear(Number.parseInt(year))
    setMonth(newDate)
  }

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(month)
    newDate.setMonth(newDate.getMonth() + increment)
    setMonth(newDate)
  }

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd-MM-yyyy")
      onChange(formattedDate)
    }
    setOpen(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    onChange(inputValue)

    if (inputValue.length === 10) {
      const parsedDate = parse(inputValue, "dd-MM-yyyy", new Date())
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate)
        setMonth(parsedDate)
      }
    } else {
      setDate(undefined)
    }
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id="dob"
              value={value}
              onChange={handleInputChange}
              placeholder="DD-MM-YYYY"
              className="w-full pl-10"
            />
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex justify-between items-center p-3">
            <Button variant="outline" size="icon" onClick={() => handleMonthChange(-1)}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Select onValueChange={handleYearChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={month.getFullYear()} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-80">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => handleMonthChange(1)}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            initialFocus
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

