import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        })
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            { $sort: { 'messages.CreatedAt': -1 } },
            {
                $group: {
                    _id: '$_id', messages: {
                        $push: '$messages'
                    }
                }
            }
        ]).exec();

        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: "messages get successfully",
            messages : user[0].messages
        }, {
            status: 200
        })
    } catch (error) {
        console.log('error geting messages==>', error)
        return Response.json({
            success: false,
            message: "Internal server error",
        }, {
            status: 500
        })
    }
}