import mongoose, { Document } from "mongoose";

export interface TestimonialInterface extends Document {
    userNameOfTestimonialGiver: string;
    userAvatarOfTestimonialGiver: string;
    userIntroOfTestimonialGiver: string;
    message: string;
    spaceId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    isLoved: boolean,
    owner: mongoose.Schema.Types.ObjectId;
}

const TestimonialSchema = new mongoose.Schema<TestimonialInterface>({
    userNameOfTestimonialGiver: {
        type: String,
        default: "Anonymous",
        max: 50,
        min: 3,
    },
    userAvatarOfTestimonialGiver: {
        type: String,
        //put default avatar string here 
    },
    userIntroOfTestimonialGiver: {
        type: String,
        max: 50
    },
    message: {
        type: String,
        max: 500,
        required: true,
    },
    isLoved: {
        type: Boolean,
        default: false,

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space',
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Testimonial = mongoose.models?.Testimonial as mongoose.Model<TestimonialInterface> || mongoose.model<TestimonialInterface>('Testimonial', TestimonialSchema);

export default Testimonial;