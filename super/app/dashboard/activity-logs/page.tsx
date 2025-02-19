'use client';
import { redirect } from "next/navigation";

export default function Overview() {
  redirect('/dashboard/activity-logs/customers');
  return (
    <></>
  );
}
