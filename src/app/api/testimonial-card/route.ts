import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { uploadUserAvatarOfTestimonialGiver } from "../testimonial/route";
import { generateProjectLogoIdenticon } from "@/helpers/project-logo-generator";
import { z } from "zod";
import { Types } from "mongoose";
import Space from "@/models/Space";
import User from "@/models/User";
import TestimonialForm from "@/models/TestimonialForm";
import { deleteFromCloudinary, doesCloudinaryResourceExist } from "@/lib/cloudinary";


export function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType === "png" || fileType === "jpeg" || fileType === "jpg") return true;
    }
    return false;
}



const makeTestimonialFormZod = z.object({
    projectTitle: z.string(),
    projectUrl: z.string().optional(),
    placeholder: z.string().optional(),
    promptText: z.string().optional(),
    spaceId: z.string(),
    projectLogo: z.any().refine((file: File | string) => {
        if (!file) return false;
        if (typeof file === "string") return true;
        return file instanceof File && file.size < 2000000 && checkFileType(file);
    }, "Max size is 2MB & only .png, .jpg, .jpeg formats are supported.").optional()
})

export async function POST(req: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData.entries());


        const parsedData = makeTestimonialFormZod.safeParse(formDataObj);

        if (!parsedData.success) {
            return NextResponse.json({ success: false, error: parsedData.error }, { status: 400 });
        }

        const userId = new Types.ObjectId(session?.user?.id);
        const userInDb = await User.findById(userId);

        if (!userInDb) {
            return NextResponse.json({ success: false, message: "Unable to find the user" }, { status: 400 });
        }

        const spaceId = new Types.ObjectId(parsedData.data.spaceId);

        const spaceFromDb = await Space.findById(spaceId);

        if (!spaceFromDb) {
            return NextResponse.json({ success: false, message: "Unable to find the space" }, { status: 400 });
        }


        const ownerId = spaceFromDb.owner;
        if (ownerId.toString() !== userId.toString()) {
            return NextResponse.json({ success: false, message: "This space doesn't belong to you" }, { status: 400 });
        }

        let cloudinaryURL: string;
        let { projectLogo } = parsedData?.data;
        const { projectTitle } = parsedData?.data;

        if (typeof (projectLogo) === "string") {
            projectLogo = null;
        }


        if (projectLogo) {
            try {
                const projectAvatar = projectLogo as File;
                cloudinaryURL = await uploadUserAvatarOfTestimonialGiver(projectAvatar);


            } catch (err) {
                return NextResponse.json({ success: false, message: "Issue in uploading project logo to cloudinary" }, { status: 400 });
            }
        } else {
            const base64ProjectLogo = generateProjectLogoIdenticon(projectTitle)
            if (!base64ProjectLogo) {
                return NextResponse.json({ success: false, message: "Issue in automatically generating project logo" }, { status: 400 });
            }
            cloudinaryURL = base64ProjectLogo;

        }

        const payload = {
            projectTitle: parsedData.data.projectTitle,
            projectUrl: parsedData.data.projectUrl || "",
            projectLogo: cloudinaryURL,
            placeholder: parsedData.data.placeholder || "Share, how did you like our services",
            promptText: parsedData.data.promptText || "Sharing my experience so far!",
            spaceId: spaceId,
        }

        const createdTestimonialForm = await TestimonialForm.create(payload);

        if (!createdTestimonialForm) {
            return NextResponse.json({ success: false, message: "Error creating your Testimonial Form" }, { status: 400 });
        }
        spaceFromDb.isNewSpace = false;
        await spaceFromDb.save();
        return NextResponse.json({ message: 'Testimonial card created', success: true }, { status: 200 });

    }
    catch (error) {
        console.error('Testimonial card creation error:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }

}

const updateTestimonialFormZod = z.object({
    projectTitle: z.string().optional(),
    projectUrl: z.string().optional(),

    placeholder: z.string().optional(),
    promptText: z.string().optional(),
    spaceId: z.string(),
    projectLogo: z.any().refine((file: File | string) => {
        if (!file) return false;
        if (typeof file === "string") return true;
        return file instanceof File && file.size < 2000000 && checkFileType(file);
    }, "Max size is 2MB & only .png, .jpg, .jpeg formats are supported.").optional()
})



export async function PUT(req: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }
        const formData = await req.formData();
        const formDataObj = Object.fromEntries(formData.entries());


        const parsedData = updateTestimonialFormZod.safeParse(formDataObj);

        if (!parsedData.success) {
            return NextResponse.json({ success: false, error: parsedData.error }, { status: 400 });
        }
        const userId = new Types.ObjectId(session?.user?.id);
        const userInDb = await User.findById(userId);
        if (!userInDb) {
            return NextResponse.json({ success: false, message: "Unable to find the user" }, { status: 400 });
        }

        const spaceId = new Types.ObjectId(parsedData?.data?.spaceId);

        const spaceFromDb = await Space.findById(spaceId);
        if (!spaceFromDb) {
            return NextResponse.json({ success: false, message: "Unable to find the space" }, { status: 400 });
        }


        const ownerId = spaceFromDb.owner;
        if (ownerId.toString() !== userId.toString()) {
            return NextResponse.json({ success: false, message: "This space doesn't belong to you" }, { status: 400 });
        }

        const existingTestimonialForm = await TestimonialForm.findOne({ spaceId: spaceId });

        if (!existingTestimonialForm) {
            return NextResponse.json({ message: 'No testimonial card found' }, { status: 404 });
        }

        let cloudinaryURL: string = existingTestimonialForm.projectLogo;

        if (parsedData?.data?.projectLogo instanceof File) {
            try {
                const projectAvatar = parsedData?.data?.projectLogo as File;
                cloudinaryURL = await uploadUserAvatarOfTestimonialGiver(projectAvatar);

                const alredyExistingLogoInDb = existingTestimonialForm.projectLogo.split('/').slice(-3).join('/').split('.')[0];
                //find if this image exists in cloudinary if it doesnt exist means we generated project logo ourselves so it doesnt exist in cloudinary
                const logoExistInCloudinary = await doesCloudinaryResourceExist(alredyExistingLogoInDb);
                if (logoExistInCloudinary) {
                    await deleteFromCloudinary(alredyExistingLogoInDb);
                }

            } catch (err) {
                return NextResponse.json({ success: false, message: "Issue in uploading project logo to cloudinary" }, { status: 400 });
            }
        }

        const updatedTestimonialForm = await TestimonialForm.findOneAndUpdate(
            { spaceId },
            {
                projectTitle: parsedData?.data?.projectTitle || existingTestimonialForm.projectTitle,
                projectUrl: parsedData?.data?.projectUrl || existingTestimonialForm.projectUrl,
                projectLogo: cloudinaryURL,
                placeholder: parsedData?.data?.placeholder || existingTestimonialForm.placeholder,
                promptText: parsedData?.data?.promptText || existingTestimonialForm.promptText,
            },
            { new: true }
        );

        if (!updatedTestimonialForm) {
            return NextResponse.json({ success: false, message: "Error updating your Testimonial Form" }, { status: 400 });
        }

        return NextResponse.json({ message: 'Testimonial card updated', success: true }, { status: 200 });

    }
    catch (error) {
        console.error('Testimonial card updation error:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }

}

// /api/testimonial-card?spaceId=kuncrabegrfawytwvvghsfvd
export async function GET(req: Request) {
    await dbConnect();
    try {

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const userId = new Types.ObjectId(session?.user?.id);
        const userInDb = await User.findById(userId);
        if (!userInDb) {
            return NextResponse.json({ success: false, message: "Unable to find the user" }, { status: 400 });
        }
        const { searchParams } = new URL(req.url);
        const spaceId = searchParams.get("spaceId");
        if (!spaceId) {
            return NextResponse.json({ success: false, message: "Space Id is required" }, { status: 400 });
        }

        const spaceObjectId = new Types.ObjectId(spaceId);

        const spaceFromDb = await Space.findById(spaceObjectId);
        if (!spaceFromDb) {
            return NextResponse.json({ success: false, message: "Unable to find the space" }, { status: 400 });
        }
        const ownerId = spaceFromDb.owner;
        if (ownerId.toString() !== userId.toString()) {
            return NextResponse.json({ success: false, message: "This space doesn't belong to you" }, { status: 400 });
        }

        const testimonialCard = await TestimonialForm.findOne({
            spaceId: spaceId
        })

        if (!testimonialCard) {
            return NextResponse.json({ message: 'No testimonial card found' }, { status: 404 })
        }


        return NextResponse.json({ message: 'Testimonial card fetched Successfully', success: true, testimonialForm: testimonialCard }, { status: 200 });

    }
    catch (error) {
        console.error('Error fetching testimonial card:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }

}


