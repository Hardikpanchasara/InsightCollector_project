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
import { Loader2 } from 'lucide-react'


const MessagePage = () => {
  const params = useParams<{ username: string }>()
  const username = params?.username

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const [isLoading, setIsLoading] = useState(false);

  const messageContent = form.watch('content')

  const onSubmit = () => {
    
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
                    placeholder="Tell us a little bit about yourself"
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

    </div>
  )
}

export default MessagePage
