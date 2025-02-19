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
    value: "loan",
    label: "Loan",
    color: 'bg-slate-300 border-slate-300 dark:text-slate-900'
  },
  {
    value: "mutualfund",
    label: "Mutual Fund",
    color: 'bg-orange-300 border-orange-300 dark:text-orange-900'
  },
  {
    value: "insurance",
    label: "Insurance",
    color: 'bg-sky-300 border-sky-300 dark:text-sky-900'
  },
  {
    value: "incometax",
    label: "Income Tax",
    color: 'bg-fuchsia-300 border-fuchsia-300 dark:text-fuchsia-900'
  },
]

export const statuses = [
  {
    value: "approved",
    label: "Approved",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "pending",
    label: "Pending",
    icon: CheckCircledIcon,
  },
  {
    value: "suspended",
    label: "Suspended",
    icon: StopwatchIcon,
  }
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]
