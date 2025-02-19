"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/registry/new-york/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import Avatar from "./avatar-initials"

export type SearchSelectItem = {
  [key: string]: any
}

type SearchSelectDropdownProps<T extends SearchSelectItem> = {
  items: T[]
  placeholder: string
  emptyText: string
  displayField: keyof T
  searchFields: (keyof T)[]
  avatarField?: keyof T
  onChange: (item: T | null) => void
  maxHeight?: number
  renderButton?: (selectedItem: T | null) => React.ReactNode
  renderItem?: (item: T) => React.ReactNode
  isLoading?: boolean
  loadingItemCount?: number
}

export function SearchSelectDropdown<T extends SearchSelectItem>({
  items,
  placeholder,
  emptyText,
  displayField,
  searchFields,
  avatarField,
  onChange,
  maxHeight = 200,
  renderButton,
  renderItem,
  isLoading = false,
  loadingItemCount = 5,
}: SearchSelectDropdownProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<T | null>(null)

  const handleSelect = (item: T) => {
    setSelectedItem(item)
    setOpen(false)
    onChange(item)
  }

  const defaultRenderButton = (item: T | null) => <>{item ? (item[displayField] as string) : placeholder}</>

  const defaultRenderItem = (item: T) => (
    <>
      {avatarField && <Avatar name={item[avatarField]} userId={item._id} />}
      <div className="flex flex-col">
        <span>{item[displayField] as string}</span>
        {searchFields.map(
          (field) =>
            field !== displayField && (
              <span key={field as string} className="text-xs text-muted-foreground">
                {item[field] as string}
              </span>
            ),
        )}
      </div>
    </>
  )

  const renderLoadingItem = () => (
    <div className="flex items-center gap-2">
      {avatarField && <Skeleton className="h-6 w-6 rounded-full" />}
      <div className="flex flex-col gap-1 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          ) : renderButton ? (
            renderButton(selectedItem)
          ) : (
            defaultRenderButton(selectedItem)
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList
            className={cn(
              "custom-scrollbar",
              (isLoading || items.length > 5) && `max-h-[${maxHeight}px] overflow-y-auto`,
            )}
          >
            {isLoading ? (
              <CommandGroup>
                {Array.from({ length: loadingItemCount }).map((_, index) => (
                  <CommandItem key={index} className="flex items-center gap-2" onSelect={() => { }}>
                    {renderLoadingItem()}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem key={item._id} onSelect={() => handleSelect(item)} className="flex items-center gap-2">
                      {renderItem ? renderItem(item) : defaultRenderItem(item)}
                      <Check
                        className={cn("ml-auto h-4 w-4", selectedItem?._id === item._id ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}