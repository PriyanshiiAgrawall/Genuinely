import mongoose, { Document } from "mongoose"

export interface ResetPasswordInterface extends Document {
    email: string,
    latestcode: string,
    codeExpiryDate: Date,
}

export const ResetPasswordSchema = new mongoose.Schema<ResetPasswordInterface>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    latestcode: {
        type: String,
        required: true,
    },
    codeExpiryDate: {
        type: Date,
        required: true,
    }
},
    { timestamps: true, strict: false }//strict Allow schema changes dynamically 
);

//for dynamic schema changes in devlopment removed old catched schema
if (mongoose.models?.ResetPassword) {
    delete mongoose.models.ResetPassword;
}

const ResetPassword = (mongoose.models?.ResetPassword as mongoose.Model<ResetPasswordInterface>) || mongoose.model<ResetPasswordInterface>('ResetPassword', ResetPasswordSchema);

export default ResetPassword;