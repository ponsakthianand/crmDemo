import { CookingPot } from "lucide-react"
import { cn } from "@/lib/utils"

export function DataLoader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <CookingPot className="size-6" />
              </div>
              <span className="sr-only">Please wait...</span>
              <h1 className="text-xl font-bold">Please wait...</h1>
              <div className="text-center text-sm">
                <p>Let us fetch the data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
