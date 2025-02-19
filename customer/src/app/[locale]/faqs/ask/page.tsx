"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SimilarQuestions from "../components/SimilarQuestions"
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs"
import './custom.css'
import PhoneInput, {
  isValidPhoneNumber
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import { useAppSelector } from "@/src/app/store/hooks"

const formSchema = z.object({
  question: z.string().min(1, "Question is required"),
  askedByName: z
    .string()
    .min(3, "Name must be at least 3 characters long") // Minimum length 5
    .min(1, "Name is required"), // Name is required
  askedByPhone: z.string().min(1, "Phone number is required")
})

export default function AskQuestion() {
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const currentUser = getCustomerInfo?.data;
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [similarQuestions, setSimilarQuestions] = useState([])
  const router = useRouter()
  const [errors, setErrors] = useState({ phone: '' });
  const [userInfo, setUserInfo] = useState({ phone: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      askedByName: currentUser?.name || "",
      askedByPhone: currentUser?.phone || "",
    },
  })

  useEffect(() => {
    if (!currentUser) return
    setUserInfo({ phone: currentUser?.phone || "" })
    setValue("askedByPhone", currentUser?.phone || "", { shouldValidate: true });
    setValue("askedByName", currentUser?.name || "", { shouldValidate: true });
  }, [currentUser])

  const { setValue } = form;

  const handlePhoneInputChange = (e) => {
    if (!isValidPhoneNumber(e)) {
      setErrors({ phone: 'Invalid phone number' });
    } else {
      setErrors({ phone: '' });
      setValue("askedByPhone", e, { shouldValidate: true });
    }
  };

  useEffect(() => {
    const fetchSimilarQuestions = async () => {
      const question = form.getValues("question")
      if (question.length > 5) {
        const response = await fetch(`/api/questions/similar?q=${encodeURIComponent(question)}`)
        const data = await response.json()
        setSimilarQuestions(data.similarQuestions)
      } else {
        setSimilarQuestions([])
      }
    }

    const debounce = setTimeout(() => {
      fetchSimilarQuestions()
    }, 300)

    return () => clearTimeout(debounce)
  }, [form.watch("question")]) // Added form.watch("question") as a dependency

  const onSubmit = async (values: z.infer<typeof formSchema>, event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          isCustomer: currentUser ? true : false,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage("Your question has been submitted and will be visible once approved.")
        form.reset()
        router.push(`/faqs/${data.kelviId}`)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || "Failed to submit question. Please try again.")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs lastValue={'Ask'} />
      <h1 className="text-3xl font-bold mb-4">Ask a Question</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="Type your question here." className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Be specific and imagine you're asking a question to another person.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div><SimilarQuestions questions={similarQuestions} /></div>
          <div className="md:flex md:justify-start gap-3">
            <FormField
              control={form.control}
              name="askedByName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input className="w-full md:w-[500px]" placeholder="John Doe" {...field} disabled={currentUser?.name ? true : false} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="askedByPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div>
                      <PhoneInput disabled={currentUser?.phone ? true : false}
                        placeholder="Enter phone number"
                        defaultCountry="IN"
                        value={userInfo.phone}
                        onChange={handlePhoneInputChange}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${currentUser?.phone ? 'text-gray-400' : ''} ${errors.phone && 'border-red-500'} w-full md:w-[500px]`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm line leading-none">{errors.phone}</p>}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </Button>
        </form>
      </Form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  )
}

