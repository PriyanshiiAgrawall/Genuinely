import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { z } from "zod";

export const isAcceptingTestimonialsZod = z.boolean();


export async function POST(req: Request) {
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
        let body;
        try {
            body = await req.json();
        } catch (err) {
            return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
        }
        const { isAcceptingTestimonials } = body;
        const isAcceptingTestimonialsChecking = isAcceptingTestimonialsZod.safeParse(isAcceptingTestimonials);

        if (!isAcceptingTestimonialsChecking.success) {
            const testimonialAcceptingErrors = isAcceptingTestimonialsChecking.error.format()._errors || [];
            return NextResponse.json({
                message: testimonialAcceptingErrors.length > 0 ? testimonialAcceptingErrors.join(', ') : "Invalid Accepting Message Status",
                success: false,
            }, {
                status: 400,
            })
        }
        //.exec -> performance optimization
        const userInDb = await User.findById(userId).exec();
        if (!userInDb) {
            return NextResponse.json({
                message: "User not found",
                success: false,
            }, { status: 400 });
        }
        userInDb.isAcceptingTestimonials = isAcceptingTestimonials;

        await userInDb.save();
        return NextResponse.json({
            message: "updated user status for testimonials acceptance",
            success: true,
            user: userInDb,
        }, { status: 200 });




    }
    catch (err) {
        return NextResponse.json({
            message: "Failed to update user status to accept testimonials",
            success: false,
        }, { status: 500 });

    }
}


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

        //.exec -> performance optimization
        const userInDb = await User.findById(userId).exec();
        if (!userInDb) {
            return NextResponse.json({
                message: "User not found",
                success: false,
            }, { status: 400 });
        }
        const isAcceptingTestimonials = userInDb.isAcceptingTestimonials;

        return NextResponse.json({
            message: "fetched user status for testimonials acceptance",
            success: true,
            isAcceptingTestimonials: isAcceptingTestimonials,
            user: userInDb,
        }, { status: 200 });




    }
    catch (err) {
        return NextResponse.json({
            message: "Failed to fetch user status to accept testimonials",
            success: false,
        }, { status: 500 });

    }
}