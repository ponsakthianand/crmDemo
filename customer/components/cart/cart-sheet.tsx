
import { ScrollArea } from "@/registry/new-york/ui/scroll-area";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/src/app/components/ui/button";
import { Badge } from "@/registry/new-york/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { CartItem } from "@/src/app/models/productInterfaces";
import { CartListItem } from "./cart-item";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/new-york/ui/sheet";

export default function CartSheet() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')) : []
  });
  const itemCount = cart.reduce((total, item) => total + item.count, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Cart"
          variant="outline"
          size="icon"
          className="relative"
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 g-6 w-6 h-6 rounded-full p-2"
            >
              {itemCount}
            </Badge>
          )}
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>
            Cart {itemCount > 0 && `(${itemCount})`}
          </SheetTitle>
        </SheetHeader>
        <Separator />
        {itemCount > 0 && (
          <div className="flex flex-1 flex-col gap-5 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-5 pr-6">
                {cart.map((item) => (
                  <div key={item._id} className="space-y-3">
                    <CartListItem item={item} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
