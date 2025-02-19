import { calculateOfferPercentage } from "@/global";

export function PriceOfferShowList({ regularPrice, salePrice }) {
  return (
    <div className="text-3xl text-gray-800 dark:text-neutral-300 flex justify-between items-center">
      {salePrice && salePrice < regularPrice && (
        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500 mb-3">
          Save {calculateOfferPercentage(regularPrice, salePrice)}%!
        </span>
      )}
      <div className="bg-white border border-gray-200 rounded-xl dark:bg-neutral-900 dark:border-neutral-800 px-4 py-2">
        {salePrice ? (
          salePrice === regularPrice ? (
            // If salePrice and regularPrice are the same, show only salePrice
            <span className="font-bold">₹{salePrice}</span>
          ) : (
            // If salePrice and regularPrice are different, show both with a strike-through
            <>
              <span className="mr-2 text-black font-bold">
                ₹{salePrice}
              </span>
              <span className="line-through text-lg text-gray-500">
                ₹{regularPrice}
              </span>
            </>
          )
        ) : (
          // If no salePrice, show regularPrice
          <span className="font-bold">₹{regularPrice}</span>
        )}
      </div>
    </div>
  )
}