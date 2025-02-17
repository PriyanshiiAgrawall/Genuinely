import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(req: Request) {
    await dbConnect();
    try {

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({
                message: "Not authenticated",
                success: false,
            }, { status: 401 });
        }

        const userId = session.user.id;

        //sends back user from db without these 3 sensitive fields
        const userInDb = await User.findById(userId).select("-password -latestOtp -otpExpiryDate").exec();

        if (!userInDb) {
            return NextResponse.json({
                message: "No user found",
                success: false,
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Successfully fetched user data',
            success: true,
            user: userInDb,
        }, {
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({
            message: "Error getting user data", error,
            success: false,
        }, { status: 500 });
    }

};
