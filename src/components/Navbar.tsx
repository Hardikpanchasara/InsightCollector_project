'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { Skeleton } from "@/components/ui/skeleton"

const Navbar = () => {
    const { data: session, status } = useSession()

    console.log('session===>', session, status)
    const user: User = session?.user as User

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col gap-3 md:flex-row justify-between items-center'>
                <a className='text-xl font-bold ' href="#">Insight Collector</a>
                {
                    status == "loading" ? (
                        <>
                            <Skeleton className="h-[20px] w-[150px] " />
                            <Skeleton className="h-[40px] w-[75px] " />
                        </>
                    ) :
                        session ? (
                            <>
                                <Link href="/sign-in">
                                    <span className=''>Welcome, {user?.username || user?.email} </span>
                                </Link>
                                <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
                            </>
                        ) : (
                            <Link href="/sign-in">
                                <Button className='w-full md:w-auto'>
                                    Sign in
                                </Button>
                            </Link>
                        )
                }
            </div>
        </nav>
    )
}

export default Navbar
