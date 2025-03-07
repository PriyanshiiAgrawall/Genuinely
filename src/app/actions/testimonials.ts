
"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/models/Testimonial";
import Space from "@/models/Space";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { deleteFromCloudinary, doesCloudinaryResourceExist } from "@/lib/cloudinary";
import TestimonialForm from "@/models/TestimonialForm";
import User from "@/models/User";

export async function getTotalTestimonials() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return 0;
    const userId = session.user?.id;
    const totalTestimonials = await Testimonial.find({ owner: userId }).countDocuments();
    return totalTestimonials;
}

export async function deleteTestimonial(testimonialId: string, spaceId: string) {

    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session?.user?.id) {
            throw new Error("Unauthorized: Session not found.");
        }


        const userid = new Types.ObjectId(session?.user?.id);
        const spaceid = new Types.ObjectId(spaceId);
        const testimonialid = new Types.ObjectId(testimonialId);


        const space = await Space.findById(spaceid);
        const testimonialToBeDeleted = await Testimonial.findById(testimonialid);

        if (!space) {
            throw new Error("Space not found.");
        }

        if (!testimonialToBeDeleted) {
            throw new Error("Testimonial not found.");
        }
        const alredyExistingLogoInDb = testimonialToBeDeleted.userAvatarOfTestimonialGiver.split('/').slice(-3).join('/').split('.')[0];

        const logoExistInCloudinary = await doesCloudinaryResourceExist(alredyExistingLogoInDb);
        if (logoExistInCloudinary) {
            await deleteFromCloudinary(alredyExistingLogoInDb);
        }
        await Space.findByIdAndUpdate(spaceId, { $pull: { testimonials: testimonialId } })
        await Testimonial.findByIdAndDelete(testimonialId);


        await Space.findByIdAndUpdate(
            spaceId,
            { $pull: { testimonials: testimonialid } }
        );


    } catch (error) {
        console.error("Error deleting testimonial:", error);
        throw error;
    }
}




export async function findTestimonialCard(uniqueName: string, spaceName: string) {
    await dbConnect();
    try {
        const user = await User.findOne({ name: uniqueName });

        let id: string;
        id = user?._id?.toString() as string;

        const userId = new Types.ObjectId(id);

        const spaceFromDb = await Space.findOne({
            owner: userId,
            name: spaceName,

        })
        id = spaceFromDb?._id?.toString() as string;
        const spaceId = new Types.ObjectId(id);
        const testimonialCard = await TestimonialForm.findOne({
            spaceId: spaceId,
        })



        // return { placeholder, promptText, testimonialId, projectTitle, projectUrl, projectLogo };
        return JSON.parse(JSON.stringify(testimonialCard));

    } catch (error) {
        throw error;
    }
}

