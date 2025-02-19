import Link from "next/link";

export default function ProductSkeleton() {

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
      <div className="relative ms-4">
        <div className="w-full h-[400px] bg-gray-200 rounded-md dark:bg-neutral-700"></div>
        <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0"></div>
        <div className="absolute bottom-0 start-0">
          <svg className="w-2/3 ms-auto h-auto text-gray-200 dark:text-neutral-700" width="630" height="451" viewBox="0 0 630 451" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="531" y="352" width="99" height="99" fill="currentColor" />
            <rect x="140" y="352" width="106" height="99" fill="currentColor" />
            <rect x="482" y="402" width="64" height="49" fill="currentColor" />
            <rect x="433" y="402" width="63" height="49" fill="currentColor" />
            <rect x="384" y="352" width="49" height="50" fill="currentColor" />
            <rect x="531" y="328" width="50" height="50" fill="currentColor" />
            <rect x="99" y="303" width="49" height="58" fill="currentColor" />
            <rect x="99" y="352" width="49" height="50" fill="currentColor" />
            <rect x="99" y="392" width="49" height="59" fill="currentColor" />
            <rect x="44" y="402" width="66" height="49" fill="currentColor" />
            <rect x="234" y="402" width="62" height="49" fill="currentColor" />
            <rect x="334" y="303" width="50" height="49" fill="currentColor" />
            <rect x="581" width="49" height="49" fill="currentColor" />
            <rect x="581" width="49" height="64" fill="currentColor" />
            <rect x="482" y="123" width="49" height="49" fill="currentColor" />
            <rect x="507" y="124" width="49" height="24" fill="currentColor" />
            <rect x="531" y="49" width="99" height="99" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div>
        <p className="h-4 bg-gray-200 rounded-full dark:bg-neutral-700 w-[60%]"></p>
        <p className="mt-3 h-4 bg-gray-200 rounded-full dark:bg-neutral-700 w-[40%]"></p>
        <ul className="mt-7 space-y-3">
          <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700"></li>
          <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700"></li>
          <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-neutral-700"></li>
        </ul>
        <div className="mt-7 grid gap-3 w-full sm:inline-flex">
          <div className="py-3 px-4 w-32 h-10 bg-gray-200 rounded-lg dark:bg-neutral-700"></div>
          <div className="py-3 px-4 w-32 h-10 bg-gray-200 rounded-lg dark:bg-neutral-700"></div>
        </div>
      </div>
    </div>
  )
}