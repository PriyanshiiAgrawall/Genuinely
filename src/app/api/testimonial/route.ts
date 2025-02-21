import dbConnect from "@/lib/dbConnect";
import Space from "@/models/Space";
import Testimonial from "@/models/Testimonial";
import TestimonialBook from "@/models/TestimonialBook";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { generateCustomAvatar } from "@/helpers/avatar-generator";
import User from "@/models/User";
import { canCollectTestimonial } from "@/lib/featureAccess";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import mongoose from "mongoose";


export async function uploadUserAvatarOfTestimonialGiver(file: File): Promise<string> {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.type)) {
        throw new Error('Invalid image type. Allowed types are JPEG, PNG, and GIF.');
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
        throw new Error('Image size exceeds 2MB limit.');
    }
    // Outputs raw binary data in ArrayBuffer form
    //ArrayBuffer is a generic, fixed-length raw binary data buffer. //a binary data file
    const arrayBuffer = await file.arrayBuffer();
    //Buffer.from(arrayBuffer) converts the browser-friendly ArrayBuffer into a Node.js Buffer, which is essential because many Node.js libraries (like Cloudinary SDK or sharp) require data in Buffer format for processing.
    const buffer = Buffer.from(arrayBuffer);

    const cloudinaryResponse = await uploadOnCloudinary(buffer, file.type);
    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        throw new Error('Failed to upload image to Cloudinary.');
    }

    return cloudinaryResponse.secure_url;
}

//http://localhost:3000/testimonial
//formData will have -> 
export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "unauthorized access",
            }, {
                status: 401,
            })

        }

        const formData = await request.json();
        if (!formData || !formData?.message || !formData.spaceId) {
            return NextResponse.json({
                success: false,
                message: "space credentials or message is missing",
            }, {
                status: 401,
            })
        }
        const spaceInDb = await Space.findById({ _id: formData.spaceId });
        if (!spaceInDb) {
            return NextResponse.json({
                success: false,
                message: "space do not exist for which you are trying to give testimonial",
            }, {
                status: 401,
            })

        }
        const userInDb = await User.findById(spaceInDb.owner)
        if (!userInDb) {
            return NextResponse.json({
                success: false,
                message: "owner for this space does not exist",
            }, {
                status: 401,
            })
        }

        const canGetThisTestimonial = canCollectTestimonial(userInDb.subscriptionTier, spaceInDb.testimonials.length);
        if (!canGetThisTestimonial) {
            return NextResponse.json({
                success: false,
                message: "owner for this space has reached the limit of getting testimonials",
            }, {
                status: 401,
            })
        }

        let cloudinaryURL: string;

        if (formData.userAvatarOfTestimonialGiver) {
            try {
                const userAvatar = formData.userAvatarOfTestimonialGiver as File;
                cloudinaryURL = await uploadUserAvatarOfTestimonialGiver(userAvatar);
            } catch (err) {
                return NextResponse.json({ success: false, message: "Issue in uploading userAvtar to cloudinary" }, { status: 400 });
            }
        } else {
            const base64Avatar = `data:image/svg+xml;base64,${Buffer.from(generateCustomAvatar(formData.message)).toString("base64")}`;
            cloudinaryURL = base64Avatar;

        }

        const data = {
            userNameOfTestimonialGiver: formData.userNameOfTestimonialGiver as string || "Anonymous",
            userAvatar: cloudinaryURL,
            userIntroOfTestimonialGiver: formData.userIntroOfTestimonialGiver as string || "I am the user of your website",
            message: formData.message as string,
            spaceId: formData.spaceId as string,
            createdAt: new Date(Date.now()),
            isLoved: false,
            owner: spaceInDb.owner,
        };
        const newTestimonial = await Testimonial.create(data);
        if (newTestimonial.errors) {
            return NextResponse.json({ success: false, message: "Issue in creading db entry for this testimonial" }, { status: 400 });
        }
        spaceInDb.testimonials.push(newTestimonial._id as unknown as mongoose.Schema.Types.ObjectId);

        await spaceInDb.save();

        return NextResponse.json({ success: true, message: 'Testimonial submitted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Testimonial creation error:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while submitting the testimonial' }, { status: 500 });

    }
}
//http://localhost:3000/testimonial?spaceId=jdnhhdbfdsbf&page=4&limit=5&query=hello
//all testimonials for a particular space, all testimonials in testimonial book,total testimonials, current page and limit will be returned
export async function GET(request: Request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "unauthorized access",
            }, {
                status: 401,
            })

        }
        const { searchParams } = new URL(request.url);
        const spaceId = searchParams.get('spaceId');
        const query = searchParams.get('query') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '9', 10);
        const spaceInDb = await Space.findById({ _id: spaceId });
        if (!spaceInDb) {
            return NextResponse.json({
                success: false,
                message: "need space id to fetch details",
            }, {
                status: 404,
            })
        }

        if (session?.user?.id?.toString() !== spaceInDb.owner.toString()) {
            return NextResponse.json({
                success: false,
                message: "unauthorized access this space does not belong to you",
            }, {
                status: 404,
            })
        }


        const skip = (page - 1) * limit;

        const searchQuery = {
            spaceId,
            $or: [
                { userNameOfTestimonialGiver: { $regex: query, $options: 'i' } },
                { message: { $regex: query, $options: 'i' } }
            ]
        };

        const testimonials = await Testimonial.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Testimonial.countDocuments(searchQuery);

        const testimonialBookForThisSpace = await TestimonialBook.findOne({ spaceId }).select('testimonials');

        let allLovedTestimonialsIdsForThisSpace: string[] = [];

        if (testimonialBookForThisSpace) {
            allLovedTestimonialsIdsForThisSpace = testimonialBookForThisSpace.testimonials.map((id: any) => id.toString());
        }
        const lovedTestimonialIdAtPresentPage = testimonials.map((testimonial) => ({
            ...testimonial.toObject(),
            isLoved: allLovedTestimonialsIdsForThisSpace.includes((testimonial._id as string).toString())
        }));

        return NextResponse.json({
            testimonials,
            lovedTestimonials: lovedTestimonialIdAtPresentPage, totalTestimonials: total, currentPage: page, limit
        }, { status: 200 });


    } catch (error) {
        return NextResponse.json({ error: 'An error occurred while fetching the testimonials' }, { status: 500 });
    }
};