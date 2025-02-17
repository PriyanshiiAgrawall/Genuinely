import { ApiResponse } from "@/types/ApiResponse";
import { OtpEmailSendingProps } from "../../emails/OTPSendingTemplate";
import resend from "@/lib/resend";
import OtpSendingEmailTemplate from "../../emails/OTPSendingTemplate";

async function signupOtpEmailSending({ name, otp, email }: OtpEmailSendingProps): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Genuinely | OTP Verification Code',
            react: OtpSendingEmailTemplate({ name, otp, email }),
        });
        return {
            success: true,
            message: 'otp email send successfully',
        }

    }
    catch (err) {
        console.log("Error sending otp for signup", err);
        return {
            success: false,
            message: 'failed to send otp email',
        }
    }
}
export default signupOtpEmailSending;
