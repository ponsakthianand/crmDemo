import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/registry/new-york/ui/select";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { baseUrl } from "@/global";
import { toast } from '@/components/ui/use-toast';;
import { fetchTicketsDataAPI } from "@/app/store/reducers/allTicketChat";

export function AssignTicket({ kid, ticket_id }: any) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authToken);
  const partnersList = useAppSelector((state) => state.partnersList);

  const partners = partnersList ? partnersList?.data?.map(item => {
    return {
      label: item?.name,
      value: item?.partner_user_id
    }
  }) : []

  const updateTicket = async (partner_id: any) => {
    await fetch(`${baseUrl}/ticket/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify({ role: 'partner', partner_id, ticket_id })
    })
      .then(async (response) => {
        if (response.ok) {
          dispatch(fetchTicketsDataAPI(accessToken?.access_token as string))
          toast({
            description: `Assignee updated!`,
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
      <PopoverContent className="w-[200px]">
        <div className="text-sm mb-2 font-medium">Update <span className="capitalize">Select assignee</span></div>
        <Select onValueChange={(data) => updateTicket(data)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={'Select assignee'} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {
                partners?.map((item, index) => {
                  return <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                })
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  )
}
