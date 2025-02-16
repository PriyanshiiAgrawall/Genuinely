import mongoose, { Document } from "mongoose"
enum SubscriptionTier {
    PRO = "Pro",
    FREE = "Free",
    LIFETIME = "Lifetime",
}
export interface OAuthAccountInterface {
    provider: string,
    providerAccountId: string

}
const OAuthAccountSchema = new mongoose.Schema<OAuthAccountInterface>({
    provider: {
        type: String,
        enum: ['google', 'github'],
        required: true,
    },
    providerAccountId: {
        type: String,
        required: true,
    }
});
interface UserInterface extends Document {
    name: string,
    image: string,
    email: string,
    latestOtp: number,
    password: string,
    isVerified: boolean,
    isNewUser: boolean,
    isAcceptingMessages: boolean,
    subscriptionTier: SubscriptionTier,
    subscriptionEndDate: Date | null,
    oauthAccounts: OAuthAccountInterface[],
    spaces: mongoose.Schema.Types.ObjectId[],
}

export const UserSchema = new mongoose.Schema<UserInterface>({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    isAcceptingMessages: {
        type: Boolean,
        required: true,
        default: true,
    },
    latestOtp: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isNewUser: {
        type: Boolean,
        default: false,
    },
    subscriptionTier: {
        type: String,
        enum: Object.values(SubscriptionTier),
        default: SubscriptionTier.FREE,
    },
    subscriptionEndDate: {
        type: Date,
        default: null,
    },
    oauthAccounts: [OAuthAccountSchema],
    spaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Space',
    },
    ],



},
    { timestamps: true });



const User = (mongoose.models.User as mongoose.Model<UserInterface>) || mongoose.model<UserInterface>('User', UserSchema);

export default User;