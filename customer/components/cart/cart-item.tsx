"use client";
import Image from "next/image";
import { CartItem } from "@/src/app/models/productInterfaces";
import { formatPrice } from "@/global";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface CartItemProps {
  item: CartItem;
}

export function CartListItem({ item }: CartItemProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')) : []
  });
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  return (
    <div className="flex items-center space-x-4">
      <div className="relative h-16 w-16 overflow-hidden rounded">
        <Image
          src={item.image[0]}
          alt={item.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          className="absolute object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 self-start text-sm">
        <span className="line-clamp-1">{item.title}</span>
        <span className="line-clamp-1 text-muted-foreground">
          {formatPrice(Number(item.salePrice))} x {item.count} ={" "}
          {formatPrice(Number(item.salePrice) * Number(item.count))}
        </span>
        <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
          {item.category}
        </span>
      </div>
      <div className='flex items-center space-x-1'>
        <Button variant="outline" size="icon" className='h-8 w-8' onClick={() => removeFromCart(item?._id)}><Trash className='h-4 w-4' /></Button>
      </div>
    </div>
  );
}
