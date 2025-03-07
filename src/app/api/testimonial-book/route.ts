import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import TestimonialBook from "@/models/TestimonialBook";
import { z } from "zod";
import Testimonial from "@/models/Testimonial";

const addTestimonialToLoveBookZod = z.object({
    testimonialId: z.string(),
    spaceId: z.string(),
    userId: z.string(),
})
export async function POST(req: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const parsedBody = addTestimonialToLoveBookZod.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json({ message: "Body is incompete", isLoved: false }, { status: 404 });
        }

        const { testimonialId, spaceId, userId } = body;

        const loveBook = await TestimonialBook.findOne({ spaceId });

        const testimonialInDb = await Testimonial.findById(testimonialId);
        if (!testimonialInDb) {
            return NextResponse.json({ message: "Testimonial does not exist", isLoved: false }, { status: 404 });
        }


        if (!loveBook) {
            const newLoveBook = await TestimonialBook.create({ spaceId, owner: userId, testimonials: [testimonialId] });
            testimonialInDb.isLoved = true;
            await testimonialInDb.save();
            return NextResponse.json({ message: "Successfully added testimonial to love book", isLoved: true, loveBook: newLoveBook }, { status: 200 });
        }

        if (loveBook.testimonials.some(id => id.toString() === testimonialId)) {

            loveBook.testimonials = loveBook.testimonials.filter(
                (id) => id.toString() !== testimonialId
            );
            await loveBook.save();
            testimonialInDb.isLoved = false;

            await testimonialInDb.save();
            return NextResponse.json({ message: "Successfully removed testimonial from love book", isLoved: false }, { status: 200 });
        }

        loveBook.testimonials.push(testimonialId);
        await loveBook.save();
        testimonialInDb.isLoved = true;
        await testimonialInDb.save();

        return NextResponse.json({ message: "Successfully added testimonial to love gallery", isLoved: true }, { status: 200 });


    } catch (error) {

        return NextResponse.json({ message: "Error adding testimonial to love gallery", error, isLoved: false }, { status: 500 });
    }


}




export async function GET(req: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }



        const { searchParams } = new URL(req.url);
        const spaceId = searchParams.get('spaceId');
        if (!spaceId) {
            return NextResponse.json({ message: "spaceId is required" }, { status: 400 });
        }

        const sessionUser = session.user;

        if (!sessionUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const loveBook = await TestimonialBook.findOne({ spaceId });

        if (!loveBook) {
            return NextResponse.json({ testimonials: [] }, { status: 200 });
        }

        const lovedTestimonials = await Testimonial.find({
            _id: { $in: loveBook.testimonials },
        });

        return NextResponse.json({ testimonials: lovedTestimonials, lovedIds: loveBook.testimonials }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error fetching love gallery", error }, { status: 500 });
    }
}