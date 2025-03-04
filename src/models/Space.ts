import mongoose, { Document } from "mongoose"


export interface spaceInterface extends Document {
    name: string,
    owner: mongoose.Schema.Types.ObjectId,
    testimonials: mongoose.Schema.Types.ObjectId[],
    isNewSpace: boolean,
    uniqueLink: string,
    createdAt: Date,
    isAcceptingTestimonials: boolean,

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
    },
    isNewSpace: {
        type: Boolean,
        default: true
    },
    isAcceptingTestimonials: {
        type: Boolean,
        required: true,
        default: true,
    },

})

const Space = mongoose.models?.Space as mongoose.Model<spaceInterface> || mongoose.model<spaceInterface>("Space", spaceSchema);
export default Space;