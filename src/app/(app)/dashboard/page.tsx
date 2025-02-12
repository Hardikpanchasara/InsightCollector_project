'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message, User } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session, status } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>(`/api/accept-messages`)
            setValue('acceptMessages', response?.data?.isAcceptingMessage)
        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: AxiosError?.response?.data?.message || "Failed fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>(`/api/get-messages`)
            setMessages(response?.data?.messages || [])
            if (refresh) {
                toast({
                    title: "Refreshed Messages",
                    description: "Showing latest messages",
                })
            }
        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: AxiosError?.response?.data?.message || "Failed fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!session || !session?.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    // handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
                acceptmessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response?.data?.message
            })
        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: AxiosError?.response?.data?.message || "Failed fetch message settings",
                variant: "destructive"
            })
        }
    }

    if (!session || !session.user) {
        return <div>{status == "loading" ?
            <div className="my-8 mx-auto p-6 bg-white rounded w-full max-w-6xl" >
                <Skeleton className="h-[40px] w-[75px] mb-4" />


                <div className="mb-4" >
                    <Skeleton className="h-[28px] w-[75px] mb-2" />
                    <div className="flex items-center" >
                        <Skeleton className="h-[40px] w-full mr-2" />
                        <Skeleton className="h-[40px] w-[64px]" />
                    </div>
                </div>

                <div className="mb-4 flex items-center" >
                    <Skeleton className="h-[24px] w-[44px] rounded-2xl" />
                    <Skeleton className="h-[24px] w-[150px] ml-4" />
                </div>
                <Separator />

                <Skeleton className="h-[40px] w-[50px] mt-4" />

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6" >
                    {[...Array(2)].map((message, index) => (
                        <Skeleton key={index} className="h-[124px] w-[550px]" />
                    ))}
                </div>
            </div>
            :
            <div>
                Please login
            </div>
        }</div>
    }

    const { username } = session?.user as User

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URL copied",
            description: "Profile URL has been copied to clipboard"
        })
    }

    return (
        <div className="my-8 mx-auto p-6 bg-white rounded w-full max-w-6xl" >
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4" >
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center" >
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipBoard} >Copy</Button>
                </div>
            </div>

            <div className="mb-4 flex items-center" >
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-4">
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant={"outline"}
                onClick={(e) => {
                    e.preventDefault()
                    fetchMessages(true)
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="h-4 w-4" />
                )}
            </Button>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6" >
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id as string}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )
                }
            </div>
        </div>
    )
}

export default Dashboard
