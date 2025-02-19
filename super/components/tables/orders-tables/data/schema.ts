import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const LastMessage = z.object({
  role: z.string().nullish(),
  name: z.string().nullish(),
  id: z.string().nullish(),
  message: z.string().nullish(),
  created_time: z.string().nullish(),
});

export const taskSchema = z.object({
  _id: z.string().nullish(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  status: z.string().nullish(),
  created_at: z.string().nullish(),
  admin_name: z.string().nullish(),
  admin: z.string().nullish(),
  Customer: z.string().nullish(),
  current_status: z.string().nullish(),
  customer_name: z.string().nullish(),
  close_description: z.string().nullish(),
  closed_by: z.string().nullish(),
  role: z.string().nullish(),
  partner: z.string().nullish(),
  partner_name: z.string().nullish(),
  // last_message: LastMessage,
  customer: z.string().nullish(),
  resoved_date: z.string().nullish(),
  resolved_date: z.string().nullish(),
});
// export const taskSchema = z.object({
//   id: z.string().nullish(),
//   title: z.string().nullish(),
//   status: z.string().nullish(),
//   label: z.string().nullish(),
//   priority: z.string().nullish(),
// })

export type Task = z.infer<typeof taskSchema>;
