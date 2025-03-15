import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { ApiResponse } from "@/types/ApiResponse";
import ResetPasswordLinkTemplate, { ResetPasswordLinkEmailSendingProps } from '../../emails/ResetPasswordLinkTemplate';


async function forgotPasswordEmailSending({ name, link }: ResetPasswordLinkEmailSendingProps): Promise<ApiResponse> {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Properly render the email component to HTML
        const emailHtml = await render(<ResetPasswordLinkTemplate name={name} link={link} />);


        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: name,
            subject: 'Genuinely | Reset Password Link',
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Forgot password link sent successfully',
        };

    } catch (err) {
        console.error("Error sending forgot password link", err);
        return {
            success: false,
            message: 'Failed to send forgot password link',
        };
    }
}
export default forgotPasswordEmailSending;
