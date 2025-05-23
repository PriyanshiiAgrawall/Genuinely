
"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";
import TestimonialBook from "@/models/TestimonialBook";

import { getServerSession } from "next-auth";
import { Types } from "mongoose";


export async function getTotalLoveBooks() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return 0;
    const userId = session.user?.id;
    const userid = new Types.ObjectId(userId);
    const totalLoveBooks = await TestimonialBook.find({ owner: userid }).countDocuments();
    return totalLoveBooks;
}

export async function getLovedTestimonials(spaceId: string, limit: number) {
    await dbConnect();

    try {

        const spaceid = new Types.ObjectId(spaceId);

        const loveGallery = await TestimonialBook.findOne({ spaceId: spaceid }).sort({ createdAt: -1 }).limit(limit).lean() as any;




        if (!loveGallery || !loveGallery.testimonials?.length) return [];


        const testimonials = await Testimonial.find(
            { _id: { $in: loveGallery?.testimonials } },
            { _id: 0, message: 1, userNameOfTestimonialGiver: 1, userAvatarOfTestimonialGiver: 1, userIntroOfTestimonialGiver: 1 }
        ).sort({ createdAt: -1 }).lean().exec();

        return JSON.parse(JSON.stringify(testimonials));

    } catch (err) {
        throw err;
    }

}




