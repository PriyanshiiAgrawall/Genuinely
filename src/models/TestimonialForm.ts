import mongoose, { Document } from "mongoose";

export interface TestimonialFormInterface extends Document {
    ProjectTitle: string;//kis reason ke liye feedback lena hai
    projectUrl: string; //reson ka proof 
    projectLogo: string;
    placeholder: string;
    promptText: string;
    spaceId: mongoose.Schema.Types.ObjectId;
}

const TestimonialFormSchema = new mongoose.Schema<TestimonialFormInterface>({

    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space',
        required: true,
        index: true,
    },
    ProjectTitle: {
        type: String,
        required: true,
    },
    projectUrl: {
        type: String,
        default: "",
    },
    projectLogo: {
        type: String,
        //put default image in here
    },
    placeholder: {
        type: String,
        required: true,
    },
    promptText: {
        type: String,
        required: true,
    },

});

const TestimonialForm = mongoose.models?.TestimonialForm || mongoose.model<TestimonialFormInterface>('TestimonialForm', TestimonialFormSchema);

export default TestimonialForm;