'use client'
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from "zod"
import { useParams } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Variable } from 'lucide-react'
import { useCompletion } from 'ai/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/ApiResponse'

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const MessagePage = () => {
  const params = useParams<{ username: string }>()
  const username = params?.username

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const [isLoading, setIsLoading] = useState(false);

  const messageContent = form.watch('content')

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username
      })
      toast({
        title: response.data.message,
        variant: "default"
      })
      form.reset({ ...form.getValues(), content: "" })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      complete('')
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className="text-4xl font-bold mb-4 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center'>
            {isLoading ? (
              <Button disabled>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button type='submit' disabled={isLoading || !messageContent} >
                Send It
              </Button>
            )}

          </div>
        </form>
      </Form>

      <div className='space-y-4 my-8' >
        <div className='space-y-2'>
          <Button
            onClick={fetchSuggestedMessages}
            className='my-4'
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className='text-xl font-semibold' >Messages</h3>
          </CardHeader>
          <CardContent className='flex flex-col space-y-4'>
            {error ?
              (<p className='text-red-500' >{error.message}</p>)
              :
              (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    className=''
                    variant="outline"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MessagePage
