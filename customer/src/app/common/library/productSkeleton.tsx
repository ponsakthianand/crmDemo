export const ProductCardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70 relative">
          <div className="h-52 flex flex-col justify-center items-center bg-gray-200 rounded-t-xl overflow-hidden dark:bg-neutral-700"></div>
          <div className="p-4 md:p-6">
            <div className="p-4 flex flex-col justify-between bg-gray-200 border border-gray-200 rounded-xl dark:bg-neutral-800 dark:border-neutral-800 absolute top-5 right-5">
              <div className="h-6 w-16 bg-gray-300 rounded-md dark:bg-neutral-600"></div>
            </div>
            <div className="mt-5">
              <span className="block mb-1 h-4 w-32 bg-gray-300 rounded-full dark:bg-neutral-600"></span>
              <div className="h-6 bg-gray-300 rounded-md dark:bg-neutral-600 mb-3 w-full"></div>
              <p className="h-4 bg-gray-300 rounded-full dark:bg-neutral-700 w-full mb-2"></p>
              <p className="h-4 bg-gray-300 rounded-full dark:bg-neutral-700 w-3/4 mb-2"></p>
              <p className="h-4 bg-gray-300 rounded-full dark:bg-neutral-700 w-1/2"></p>
            </div>
          </div>
          <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
            <div className="w-full py-3 px-4 bg-gray-300 rounded-es-xl dark:bg-neutral-700"></div>
            <div className="w-full py-3 px-4 bg-gray-300 rounded-ee-xl dark:bg-neutral-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
};