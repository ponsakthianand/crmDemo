'use client';
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { CartItem, EventProduct } from "@/src/app/models/productInterfaces";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateCartVailableStatus } from "@/src/app/store/reducers/isCartAvaialbe";
import { useAppDispatch, useAppSelector } from "@/src/app/store/hooks";
import { X, ShoppingCart, CalendarCheck } from "lucide-react";
import { PriceOfferShow } from "@/src/app/common/components/priceOfferShow";
import CryptoJS from 'crypto-js';

export function ProductPage({ productData }) {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const product = productData;
  const cartForCheckout = useAppSelector((state) => state.cartData);
  const sanitizedDescription = DOMPurify.sanitize(product?.description || '');

  const addToCart = (product: CartItem) => {
    const existingProduct = cartForCheckout?.data?.find((item) => item._id === product._id);
    if (existingProduct) {
      return cartForCheckout?.data?.map((item) =>
        item._id === product._id ? { ...item, count: item.count + 1 } : item
      );
    }
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
    <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-10">
      <div>
        <div className="relative bg-gradient-to-tr from-gray-200 via-primary-800 to-secondary-400 p-3 rounded-md">
          <img className="w-full rounded-md" src={product?.image?.length ? product?.image[0] : 'https://e5osher1gwoyuako.public.blob.vercel-storage.com/webapp/static/image-not-found-nKKKH17xDpgwzZmkAqDMk8fvUqa7qi.png'} alt="Hero Image" />
        </div>
      </div>
      <div>
        <h1 className="block text-3xl font-bold text-gray-800 sm:text-3xl lg:text-4xl lg:leading-tight dark:text-white">
          {product?.title}
        </h1>

        <div>
          <div className="p-4 pl-0 flex flex-col justify-between dark:bg-neutral-900 dark:border-neutral-800">
            <PriceOfferShow regularPrice={product.regularPrice} salePrice={product.salePrice} />
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 w-full sm:inline-flex">
          {
            isProductInCart(product._id) ? (<div onClick={() => removeFromCart(product._id)} className="py-3 px-4 inline-flex justify-center items-center cursor-pointer gap-x-1 lg:gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-products-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
              <X /> Remove from Cart
            </div>) : (
              <div onClick={() => addToCart(product)} className="py-3 px-4 inline-flex justify-center items-center cursor-pointer gap-x-1 lg:gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-products-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                <ShoppingCart /> Add to Cart
              </div>)
          }
          <div onClick={() => handleBuyNow(product)} className="py-3 px-4 inline-flex justify-center items-center cursor-pointer gap-x-1 lg:gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary-800 text-white hover:bg-primary-900 focus:outline-none focus:bg-primary-900 disabled:opacity-50 disabled:pointer-products-none">
            <CalendarCheck /> Register Now!
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </div>
        </div>
      </div>
      <div className="mt-3 text-base text-gray-800 dark:text-neutral-400 lg:col-span-2">
        <div className="text-2xl font-bold mb-8">Description</div>
        <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
      </div>
    </div>
  )
}