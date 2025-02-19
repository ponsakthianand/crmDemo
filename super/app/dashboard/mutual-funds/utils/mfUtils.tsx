export const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500";
    case "Reconsider":
      return "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white";
  }
};

export const FundStatusBadge = (status: any) => {
  return <span className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
    {status}
  </span>
}