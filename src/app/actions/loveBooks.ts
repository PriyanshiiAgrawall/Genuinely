
"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import TestimonialBook from "@/models/TestimonialBook";
import { getServerSession } from "next-auth";

export async function getTotalLoveBooks() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return 0;
    const userId = session.user?.id;
    const totalLoveBooks = await TestimonialBook.find({ owner: userId }).countDocuments();
    return totalLoveBooks;
}
