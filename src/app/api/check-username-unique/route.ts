import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

console.log('usernameQuerySchema', usernameQuerySchema)

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }
        //validation with zod 
        const result = usernameQuerySchema.safeParse(queryParam)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            console.log('usernameErrors===>', usernameErrors)
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ?
                    usernameErrors.join(', ')
                    : "Invalid query parameters"
            }, {
                status: 400
            })
        }

        const { username } = result?.data

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {
                status: 200
            })
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {
            status: 500
        })
    }
}