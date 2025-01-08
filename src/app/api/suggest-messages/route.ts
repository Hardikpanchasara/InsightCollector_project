import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
    try {
        const { text } = await generateText({
            model: google("models/gemini-1.5-pro-latest"),
            system: 'You are a helpful assistant.',
            prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. just give questions in response which structure I provided not anything else."
        })
        console.log('text', text)

        return Response.json({ text });
        
    } catch (error) {
        console.log('Error while generating suggestions==>', error)
        return Response.json({
            success: false,
            message: "Internal server error",
        }, {
            status: 500
        })
    }
}
