import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const labels = [
  {
    value: "Loan",
    label: "Loan",
    color: 'bg-slate-300 border-slate-300 dark:text-slate-900'
  },
  {
    value: "Mutual Fund",
    label: "Mutual Fund",
    color: 'bg-orange-300 border-orange-300 dark:text-orange-900'
  },
  {
    value: "Insurance",
    label: "Insurance",
    color: 'bg-sky-300 border-sky-300 dark:text-sky-900'
  },
  {
    value: "Auditing Services",
    label: "Auditing Services",
    color: 'bg-fuchsia-300 border-fuchsia-300 dark:text-fuchsia-900'
  },
]

export const statuses = [
  {
    value: "open",
    label: "Open",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "closed",
    label: "Closed",
    icon: CheckCircledIcon,
  },
  {
    value: "inprogress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
]
