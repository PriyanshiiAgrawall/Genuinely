import mongoose, { Document } from "mongoose";

export interface TestimonialInterface extends Document {
    userName: string;
    userAvatar: string;
    userIntro: string;
    message: string;
    spaceId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    owner: mongoose.Schema.Types.ObjectId;
}

const TestimonialSchema = new mongoose.Schema<TestimonialInterface>({
    userName: {
        type: String,
        default: "Anonymous",
        max: 50,
        min: 3,
    },
    userAvatar: {
        type: String,
        //put default avatar string here 
    },
    userIntro: {
        type: String,
        max: 50
    },
    message: {
        type: String,
        max: 500,
        required: true,
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

const Testimonial = mongoose.models?.Testimonial || mongoose.model<TestimonialInterface>('Testimonial', TestimonialSchema);

export default Testimonial;