import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }
}