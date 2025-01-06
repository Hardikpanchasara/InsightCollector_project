import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerficationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email : string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const { data , error} = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Verificaition code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        if (error) {
            console.log('error', error)
            return{success: false, message: "Failed to send verification email." }
        }
        return{success: true, message: "Verification email send successfully."}
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return{success: false, message: "Failed to send verification email."}
    }
}