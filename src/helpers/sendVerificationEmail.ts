import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerficationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//     email : string,
//     username: string,
//     verifyCode: string
// ): Promise<ApiResponse> {
//     try {
//         const { data , error} = await resend.emails.send({
//             from: 'Acme <onboarding@resend.dev>',
//             to: [email],
//             subject: 'Verificaition code',
//             react: VerificationEmail({ username, otp: verifyCode }),
//         });
//         if (error) {
//             console.log('error', error)
//             return{success: false, message: "Failed to send verification email." }
//         }
//         return{success: true, message: "Verification email send successfully."}
//     } catch (emailError) {
//         console.error("Error sending verification email", emailError)
//         return{success: false, message: "Failed to send verification email."}
//     }
// }


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Ensure the email HTML is correctly rendered into a string
        //   const emailHtml = VerificationEmail({ username, otp: verifyCode })

        if (typeof window === 'undefined') {
            const nodemailer = require('nodemailer');

            // Create an SMTP transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER, // Replace with your Gmail address
                    pass: process.env.EMAIL_PASS, // Replace with your app-specific password
                },
            });

            // Define email options
            const mailOptions = {
                from: `${process.env.EMAIL_USER}`, // Replace with your sender email
                to: email,
                subject: "Verification Code",
                html: `
            <div>
            <h2>Hello ${username},</h2>
            <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
            <h3>${verifyCode}</h3>
            <p>If you did not request this code, please ignore this email.</p>
            </div>
            `,
            };

            // Send the email
            await transporter.sendMail(mailOptions);
        }

        return {
            success: true,
            message: "Verification email sent successfully.",
        };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email.",
        };
    }
}
