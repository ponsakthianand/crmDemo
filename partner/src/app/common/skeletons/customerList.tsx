const CustomerListSkeleton = () => {
  return (
    <div role="status" className="space-y-2.5 animate-pulse">
      <div className="grid grid-cols-3 gap-3">
        <div className="w-full">
          <div className='hs-tooltip-toggle max-w-xs p-3 flex items-center gap-x-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700'>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300"></span>
            </div>
            <div className="grow">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-white bg-slate-200 h-3"></h4>
              <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-neutral-500 bg-slate-100 h-3 w-2/4 mt-2"></p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className='hs-tooltip-toggle max-w-xs p-3 flex items-center gap-x-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700'>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300"></span>
            </div>
            <div className="grow">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-white bg-slate-200 h-3"></h4>
              <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-neutral-500 bg-slate-100 h-3 w-2/4 mt-2"></p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className='hs-tooltip-toggle max-w-xs p-3 flex items-center gap-x-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700'>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300"></span>
            </div>
            <div className="grow">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-white bg-slate-200 h-3"></h4>
              <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-neutral-500 bg-slate-100 h-3 w-2/4 mt-2"></p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className='hs-tooltip-toggle max-w-xs p-3 flex items-center gap-x-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700'>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300"></span>
            </div>
            <div className="grow">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-white bg-slate-200 h-3"></h4>
              <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-neutral-500 bg-slate-100 h-3 w-2/4 mt-2"></p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className='hs-tooltip-toggle max-w-xs p-3 flex items-center gap-x-3 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700'>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300"></span>
            </div>
            <div className="grow">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-white bg-slate-200 h-3"></h4>
              <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-neutral-500 bg-slate-100 h-3 w-2/4 mt-2"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerListSkeleton;