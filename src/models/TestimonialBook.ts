import mongoose, { Document } from "mongoose";

export interface TestimonialBookInterface extends Document {
    testimonials: mongoose.Schema.Types.ObjectId[];
    spaceId: mongoose.Schema.Types.ObjectId;
    owner: mongoose.Schema.Types.ObjectId;
    createdAt: Date;

}

const TestimonialBookSchema = new mongoose.Schema<TestimonialBookInterface>({
    testimonials: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Testimonial",
        },
    ],
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Space",
        index: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TestimonialBook = mongoose.models?.TestimonialBook as mongoose.Model<TestimonialBookInterface> || mongoose.model<TestimonialBookInterface>("TestimonialBook",
    TestimonialBookSchema);


export default TestimonialBook;