'use client';
import { redirect } from "next/navigation";

export default function Overview() {
  redirect('/profile/overview');
  return (
    <></>
  );
}
