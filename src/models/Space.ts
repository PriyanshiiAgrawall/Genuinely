import mongoose, { Document } from "mongoose"


interface spaceInterface extends Document {
    name: string,
    owner: mongoose.Schema.Types.ObjectId,
    testimonials: mongoose.Schema.Types.ObjectId[],
    isNewSpace: boolean,
    uniqueLink: string,
    createdAt: Date
}


const spaceSchema = new mongoose.Schema<spaceInterface>({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 2,
        maxlength: 50,
        index: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    testimonials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Testimonial",

    }],
    uniqueLink: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})

const Space = mongoose.models?.Space || mongoose.model<spaceInterface>("Space", spaceSchema);
export default Space;