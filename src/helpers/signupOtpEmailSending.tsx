import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import OtpSendingEmailTemplate from '../../emails/OTPSendingTemplate';
import { ApiResponse } from "@/types/ApiResponse";
import { OtpEmailSendingProps } from "../../emails/OTPSendingTemplate";

// async function signupOtpEmailSending({ name, otp, email }: OtpEmailSendingProps): Promise<ApiResponse> {
//     try {
//         console.log("otp sending initiated")
//         await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: 'Genuinely | OTP Verification Code',
//             react: OtpSendingEmailTemplate({ name, otp, email }),
//         });
//         return {
//             success: true,
//             message: 'otp email send successfully',
//         }

//     }
//     catch (err) {
//         console.log("Error sending otp for signup", err);
//         return {
//             success: false,
//             message: 'failed to send otp email',
//         }
//     }
// }

async function signupOtpEmailSending({ name, otp, email }: OtpEmailSendingProps): Promise<ApiResponse> {
    try {


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Properly render the email component to HTML
        const emailHtml = await render(<OtpSendingEmailTemplate name={name} otp={otp} email={email} />);


        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: 'Genuinely | OTP Verification Code',
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'OTP email sent successfully',
        };

    } catch (err) {
        console.error("Error sending OTP for signup", err);
        return {
            success: false,
            message: 'Failed to send OTP email',
        };
    }
}
export default signupOtpEmailSending;
