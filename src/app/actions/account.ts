"use server"


import forgotPasswordEmailSending from "@/helpers/forgotPasswordEmailSending";
import dbConnect from "@/lib/dbConnect";
import ResetPassword from "@/models/ResetPassword";
import Space from "@/models/Space";
import TestimonialBook from "@/models/TestimonialBook";
import TestimonialForm from "@/models/TestimonialForm";
import User from "@/models/User";
import { Types } from "mongoose";



export async function getSubTier(spaceOwner: string) {
    await dbConnect();
    try {
        const userId = new Types.ObjectId(spaceOwner);
        const user = await User.findById(userId).lean();
        if (!user) {
            throw new Error("User not found.");
        }
        return user.subscriptionTier.toString();

    }
    catch (error) {
        console.error("Error fetching subscription tier od user", error);
        throw error;
    }

}


export async function deleteUser(userId: string) {
    await dbConnect();
    try {
        const userid = new Types.ObjectId(userId);
        const user = await User.findById(userid);

        if (!user) {
            throw new Error("User not found.");
        }

        const spaces = await Space.find({ owner: userid }).select("_id").exec();
        const spaceIds = spaces.map(space => space._id);

        if (spaceIds.length > 0) {
            await TestimonialForm.deleteMany({ spaceId: { $in: spaceIds } });
        }
        await ResetPassword.deleteMany({ email: user.email });
        await Space.deleteMany({ owner: userid });
        await TestimonialBook.deleteMany({ owner: userid });
        await User.findByIdAndDelete(userid);

        return { success: true, message: "User deleted successfully" };


    }
    catch (error) {
        console.error("Error fetching subscription tier od user", error);
        throw error;
    }

}


export async function updateName(userId: string, uniqueName: string) {
    await dbConnect();
    try {
        const userid = new Types.ObjectId(userId);
        const user = await User.findById(userid)
        if (!user) {
            throw new Error("User not found.");
        }
        const users = await User.find({ name: uniqueName });
        if (users.length > 1) {
            const verifiedUsers = users.filter(user => user.isVerified);
            if (verifiedUsers.length > 0) {
                return false;
            }
        }
        if (users.length > 0 && (!users[0] || users[0]?._id?.toString() === userId.toString())) {
            //this user has this 
            return true
        }
        else if (users[0]?._id?.toString() !== userId.toString()) {
            //someone has it already
            const verifiedUser = users.find(user => user.isVerified);
            if (verifiedUser && verifiedUser._id.toString() !== userId.toString()) {
                return false;
            }
        }


        user.name = uniqueName;
        await user.save();
        return true;


    }
    catch (error) {
        console.error("Error updating uniquename", error);
        return false;
    }

}


export async function isAccepting(uniqueName: string, spaceName: string) {
    await dbConnect();
    try {
        const user = await User.findOne({ name: uniqueName }).lean();

        if (!user) {
            throw new Error("User not found.");
        }
        const id = user._id;


        const space = await Space.findOne({ owner: id, name: spaceName }).lean();


        if (space?.isAcceptingTestimonials) {

            return true;
        }
        else {

            return false;
        }


    }
    catch (error) {
        console.error("Error fetching acceptance for testimonials", error);
        return false;
    }
};

export async function isAcceptingT(spaceId: string) {
    await dbConnect();
    try {

        const id = new Types.ObjectId(spaceId);
        const space = await Space.findById(id).lean();

        if (space?.isAcceptingTestimonials) {
            return true;
        }
        else {

            return false;
        }


    }
    catch (error) {
        console.error("Error fetching acceptance for testimonials", error);
        return false;
    }
};



export async function toggleAcceptance(spaceId: string) {
    await dbConnect();
    try {
        const id = new Types.ObjectId(spaceId);
        const space = await Space.findById(id) as any;

        if (space?.isAcceptingTestimonials) {
            space.isAcceptingTestimonials = false;
        }
        else {
            space.isAcceptingTestimonials = true;

        }
        await space.save();
        return true;

    }
    catch (error) {
        console.error("Error fetching acceptance for testimonials", error);
        return false;
    }
};

export async function disconnectOAuth(userId: string, provider: string) {
    await dbConnect();

    try {
        await User.findByIdAndUpdate(userId, { $pull: { oauthAccounts: { provider } } });

    } catch (error) {
        console.error("Error disconnecting OAuth provider:", error);
        throw error

    }
}

export async function resetPasswordLinkTimeSaveToDb(randomcode: string, randomCodeExpiryDate: Date, name: string) {
    await dbConnect();
    try {
        const user = await User.findOne({ email: name });
        if (!user) {
            return null
        }
        const reset = await ResetPassword.findOne({ email: name });
        if (reset) {
            reset.latestcode = randomcode;
            reset.codeExpiryDate = randomCodeExpiryDate;
            await reset.save();
        } else {
            const newreset = {
                email: name,
                latestcode: randomcode,
                codeExpiryDate: randomCodeExpiryDate,
            }
            await ResetPassword.create(newreset);
        }

        return user.name;



    } catch (error) {
        console.error("Error disconnecting OAuth provider:", error);
        throw error
    }


}

export async function forgotPasswordEmailSendingServer(payload) {
    try {
        await forgotPasswordEmailSending(payload);
    } catch (err) {
        throw new err;
    }
}