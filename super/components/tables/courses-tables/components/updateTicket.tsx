import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/registry/new-york/ui/select";
import { labels, priorities, statuses } from "../data/data";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { baseUrl } from "@/global";
import { toast } from '@/components/ui/use-toast';;
import { fetchTicketsDataAPI } from "@/app/store/reducers/allTicketChat";


export function UpdateTicket({ kid, type, ticket_id, selected }: any) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  let selectValue: any[] = []

  if (type === 'category') {
    selectValue = labels
    selected = selected || 'Uncategorized'
  } else if (type === 'status') {
    selectValue = statuses
  } else if (type === 'priority') {
    selectValue = priorities
    selected = selected || 'Unprioritized'
  }

  const updateTicket = async (value: any) => {
    await fetch(`${baseUrl}/edit/tickets/${ticket_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ [type]: value })
    })
      .then(async (response) => {
        if (response.ok) {
          dispatch(fetchTicketsDataAPI(accessToken?.access_token as string))
          toast({
            description: `${type} updated!`,
          })
        } else if (response.status === 401) {
        }
      })
      .catch((error) => {
        console.error(error)
      });
  }

  return (
    <Popover>
      <PopoverTrigger>
        {kid}
      </PopoverTrigger>
      <PopoverContent className="w-[170px]">
        <div className="text-sm mb-2 font-medium">Update <span className="capitalize">{type}</span></div>
        <Select onValueChange={(data) => updateTicket(data)}>
          <SelectTrigger className="w-[134px]">
            <SelectValue placeholder={selected} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {
                selectValue?.map((item, index) => {
                  return <SelectItem key={index} disabled={item?.label === selected} value={item.value}>{item.label}</SelectItem>
                })
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  )
}
