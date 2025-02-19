import { useTimeAgo } from 'next-timeago';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { dateToLocalTimeDateYear } from '@/global';

export default function LastSeen(props: { date: string | number | Date; isAgo?: boolean }) {
  const { TimeAgo } = useTimeAgo();

  return (
    <div>
      {props?.isAgo ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <TimeAgo date={props?.date} locale={'en'} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{dateToLocalTimeDateYear(props?.date as string)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>) : (
        dateToLocalTimeDateYear(props?.date as string)
      )}
    </div>
  );
}