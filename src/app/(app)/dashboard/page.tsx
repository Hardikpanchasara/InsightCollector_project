'use client'

import { useToast } from "@/hooks/use-toast"
import { User } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const Dashboard = () => {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()

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

    if(!session || !session.user) {
        return <div>Please login</div>
    }

    return (
       <div className="my-8">
dashboard
       </div>
    )
}

export default Dashboard
