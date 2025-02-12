'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const SignUpForm = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()
    const router = useRouter()
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    })

    const checkUsernameUnique = async (username: string) => {
        if (!username) return; // No need to check for empty username

        setIsCheckingUsername(true)
        setUsernameMessage('')

        try {
            const response = await axios.get(`/api/check-username-unique?username=${username}`)
            setUsernameMessage(response?.data?.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            setUsernameMessage(axiosError?.response?.data?.message ?? "Error checking username")
        } finally {
            setIsCheckingUsername(false)
        }
    }

    const handleUsernameChange = (value: string) => {
        setUsername(value)

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current) // Clear the previous timer
        }

        debounceTimer.current = setTimeout(() => {
            checkUsernameUnique(value) // Call the API after 300ms
        }, 300)
    }

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/sign-up`, data)
            toast({
                title: 'Success',
                description: response?.data?.message
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError?.response?.data?.message
            toast({
                title: 'Signup failed',
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-green-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tighter lg:text-5xl mb-6">
                        Join InsightCollector
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} onChange={(e) => { field.onChange(e); handleUsernameChange(e.target.value) }} />
                                    </FormControl>
                                    <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`} > {isCheckingUsername && <Loader2 className="animate-spin" />} {usernameMessage}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} >
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                ) : ('Sign up')
                            }
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default SignUpForm
