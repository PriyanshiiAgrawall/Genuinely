
"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { deleteFromCloudinary, doesCloudinaryResourceExist } from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";
import TestimonialBook from "@/models/TestimonialBook";
import TestimonialForm from "@/models/TestimonialForm";
import User from "@/models/User";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";

export async function getTotalSpaces() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) return 0;
    const userId = session.user?.id;
    const totalSpaces = await Space.find({ owner: userId }).countDocuments();
    return totalSpaces;
}

export async function deleteSpace(spaceId: string) {

    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session?.user?.id) {
            throw new Error("Unauthorized: Session not found.");
        }
        const userId = session.user.id;
        const space = await Space.findById(spaceId);

        if (!space) {
            throw new Error("Space not found.");
        }
        // Delete related data
        await Promise.all([
            TestimonialBook.deleteMany({ spaceId }),
            Testimonial.deleteMany({ spaceId }),
            Space.findByIdAndDelete(spaceId),
            User.findByIdAndUpdate(userId, { $pull: { spaces: spaceId } })
        ]);
        const testimonialFormFromDb = await TestimonialForm.findOne({ spaceId: spaceId });
        const avatar = testimonialFormFromDb?.projectLogo?.split('/').slice(-3).join('/').split('.')[0];
        if (avatar) {
            const logoExistInCloudinary = await doesCloudinaryResourceExist(avatar);
            if (logoExistInCloudinary) {
                await deleteFromCloudinary(avatar);
            }
        }
        await TestimonialForm.deleteMany({ spaceId });
        await space.deleteOne();

    } catch (error) {
        console.error("Error deleting space:", error);
        throw error;
    }
}


export async function makeSpaceOld(spaceId: string) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session?.user?.id) {
            throw new Error("Unauthorized: Session not found.");
        }



        const spaceid = new Types.ObjectId(spaceId);



        const space = await Space.findById(spaceid);


        if (!space) {
            throw new Error("Space not found.");
        }
        space.isNewSpace = false;
        await space.save();

    }
    catch (error) {
        console.error("Error make space old", error);
        throw error;
    }

}



export async function getSpaceOwner(spaceId: string) {
    await dbConnect();
    try {

        const spaceid = new Types.ObjectId(spaceId);
        const space = await Space.findById(spaceid);
        if (!space) {
            throw new Error("Space not found.");
        }
        return space.owner.toString();


    }
    catch (error) {
        console.error("Error getting space owner", error);
        throw error;
    }

}

