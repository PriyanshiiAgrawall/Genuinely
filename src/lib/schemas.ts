import { z } from "zod";

export const signInSchemaZod = z.object({
    email: z.string(),
    password: z.string().min(6, "Password must be atleast 6 characters"),
})


export const uniqueNameZod = z.string()
    .min(2, "Unique Name must have at least 2 characters")
    .max(15, "Unique Name must have a maximum of 15 characters")
    .regex(/^(?=.*\d)[a-zA-Z0-9_]+$/, "Unique Name must contain at least one number and no special characters other than underscore");


export const signUpSchemaZod = z.object({
    name: uniqueNameZod,
    email: z.string().email("Invalid Email Format"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
})

export const otpSchemaZod = z.object({
    otp: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    })
})

export function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType === "png" || fileType === "jpeg" || fileType === "jpg") return true;
    }
    return false;
}


export const avatarSchema = z
    .any()
    .refine((file) => file instanceof File, "Invalid file type.")
    .refine((file) => file.size < 2000000, "File size must be under 2MB.");


export const testimonialCardSchemaZod = z.object({
    projectTitle: z.string(),
    projectUrl: z.string(),
    promptText: z.string(),
    placeholder: z.string(),
    projectLogo: z.any().refine((file: File | string) => {
        if (!file) return false;
        if (typeof file === "string") return true;
        return file instanceof File && file.size < 2000000 && checkFileType(file);
    }, "Max size is 2MB & only .png, .jpg, .jpeg formats are supported.")
});