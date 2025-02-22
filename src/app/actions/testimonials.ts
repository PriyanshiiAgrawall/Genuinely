
"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";
import { getServerSession } from "next-auth";

export async function getTotalTestimonials() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return 0;
    const userId = session.user?.id;
    const totalTestimonials = await Testimonial.find({ owner: userId }).countDocuments();
    return totalTestimonials;
}
