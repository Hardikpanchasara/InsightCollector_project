'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import carouselData from "@/data/messages.json"
import Autoplay from "embla-carousel-autoplay"

const Home = () => {
    return (
        <>
            <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
                <section className='text-center mb-8 md:mb-12'>
                    <h1 className='text-3xl md:text-5xl font-bold'>
                        Try out Insight Collector for Feedback or Anonymous messages.
                    </h1>
                    <p className='mt-3 md:mt-4 text-base md:text-lg'>
                        Explore Insight Collector - Where your identity remians a secret.
                    </p>
                </section>
                <Carousel className="w-full max-w-xs"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}>
                    <CarouselContent>
                        {carouselData.map((message, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card>
                                        <CardHeader>
                                            {message.title}
                                        </CardHeader>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            {message.content}
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </main>
            <footer className="text-center p-4 md:p-6 font-semibold text-sm">
                &copy; 2025 Insight Collector. All rights reserved.
            </footer>
        </>
    )
}

export default Home