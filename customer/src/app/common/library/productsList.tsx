'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Link from 'next/link';
import { CalendarCheck, LoaderCircle, ShoppingCart, X } from 'lucide-react';
import { CartItem, EventProduct } from '../../models/productInterfaces';
import { stripHtmlTags } from '@/global';
import { updateCartVailableStatus } from '../../store/reducers/isCartAvaialbe';
import CryptoJS from 'crypto-js';
import { toast } from '@/components/ui/use-toast';
import { PriceOfferShowList } from '../components/priceOfferShowList';

export function ProductsList({ productsResponse, route }) {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const products = productsResponse;
  const cartForCheckout = useAppSelector((state) => state.cartData);

  const addToCart = (product: CartItem) => {
    const existingProduct = cartForCheckout?.data?.find((item) => item._id === product._id);
    if (existingProduct) {
      return cartForCheckout?.data?.map((item) =>
        item._id === product._id ? { ...item, count: item.count + 1 } : item
      );
    }
    toast({
      title: "Added to the cart",
      description: `${product.title} has been added.`,
      variant: "default",
    })
    const updatedItems = [...cartForCheckout?.data, { ...product, count: 1 }];
    dispatch(updateCartVailableStatus(updatedItems))
  };

  const isProductInCart = (productId) => {
    return Array.isArray(cartForCheckout?.data) && cartForCheckout?.data?.some((item) => item._id === productId);
  };


  const removeFromCart = (productId) => {
    const removeItem = cartForCheckout?.data?.filter((item) => item._id !== productId)
    dispatch(updateCartVailableStatus(removeItem))
  };

  const handleBuyNow = (product: EventProduct) => {
    const productData = {
      _id: product?._id,
      title: product?.title,
      regularPrice: product?.regularPrice,
      salePrice: product?.salePrice,
      count: 1,
    };

    // Encrypt product data
    const encryptedProduct = CryptoJS.AES.encrypt(
      JSON.stringify(productData),
      process.env.ENCRYPTION_KEY || 'fallback-secret-key'
    ).toString();

    // Append encrypted data to the URL
    router.push(`/checkout?product=${encodeURIComponent(encryptedProduct)}`);
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70 relative">
          <div className="h-52 flex flex-col justify-center items-center bg-gray-100 rounded-t-xl overflow-hidden">
            <Link href={`/${route}/[id]`} as={`/${route}/${product.slug}`}>
              <img className="mx-auto" src={product?.image?.length ? product?.image[0] : 'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/image-not-found-nKKKH17xDpgwzZmkAqDMk8fvUqa7qi.png'} alt="" />
            </Link>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex flex-col justify-between absolute top-2 right-2 w-full">
              <PriceOfferShowList regularPrice={product.regularPrice} salePrice={product.salePrice} />
            </div>
            <span className="block mb-1 text-xs font-semibold uppercase text-primary-600 dark:text-primary-500">
              {product.category}
            </span>
            <Link href={`/${route}/[id]`} as={`/${route}/${product.slug}`}>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                {product.title}
              </h3>
            </Link>
            <p className="mt-3 text-gray-800 text-base dark:text-neutral-500 truncate max-w-[300px]">
              {stripHtmlTags(product.description)}
            </p>
          </div>
          <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
            {isProductInCart(product._id) ? (
              <a type="button" onClick={() => removeFromCart(product._id)} className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-sm hover:bg-red-100 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                <X /> Remove from Cart
              </a>
            ) : (
              <a type="button" onClick={() => addToCart(product)} className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-sm hover:bg-primary-100 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                <ShoppingCart /> Add to Cart
              </a>
            )}
            <a type="button" onClick={() => handleBuyNow(product)} className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-secondary-100 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
              <CalendarCheck /> Buy Now!
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
