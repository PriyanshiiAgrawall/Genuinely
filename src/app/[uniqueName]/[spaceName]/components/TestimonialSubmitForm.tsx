
'use client';

import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FcAddImage } from "react-icons/fc";
import { exampleAvatar } from "@/helpers/avatar-generator";
import { useToast } from "@/hooks/use-toast";
import { defaultProjectLogo } from "@/helpers/project-logo-generator";
import { Thankyou } from "./Thankyou";


function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType === "png" || fileType === "jpeg" || fileType === "jpg") return true;
    }
    return false;
}

const testimonialSchema = z.object({
    userNameOfTestimonialGiver: z.string().min(1, "Name is required").default("Anonymous User"),
    userIntroOfTestimonialGiver: z.string().default("Hi! I use your app daily"),
    message: z.string().min(3, "Message is too short"),
    spaceId: z.string(),
    userAvatarOfTestimonialGiver: z.any().refine((file: File | string) => {
        if (!file) return false;
        if (typeof file === "string") return true;
        return file instanceof File && file.size < 2000000 && checkFileType(file);
    }, "Max size is 2MB & only .png, .jpg, .jpeg formats are supported.").default(exampleAvatar)
});


export const TestimonialSubmitForm = ({ testimonialCardData }: { testimonialCardData: any }) => {
    const { toast } = useToast();
    const [userAvatarPreview, setUserAvatarPreview] = useState<string>(exampleAvatar);
    const [loading, setLoading] = useState(false);
    const [showThankyou, setShowThankyou] = useState(false);
    const [thankyouName, setThankyouName] = useState<string>("Anonymous User");
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            userNameOfTestimonialGiver: 'Anonymous User',
            userIntroOfTestimonialGiver: 'Hi! I use your app daily',
            message: '',
            spaceId: testimonialCardData.spaceId || '',
            userAvatarOfTestimonialGiver: exampleAvatar,
        }
    });


    const userAvatar = watch("userAvatarOfTestimonialGiver");

    useEffect(() => {
        if (userAvatar && userAvatar.length > 0 && userAvatar instanceof File) {
            const avatarFile = userAvatar;
            const avatarURL = URL.createObjectURL(avatarFile);
            setUserAvatarPreview(avatarURL);
            return () => URL.revokeObjectURL(avatarURL);
        }
    }, [userAvatar]);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.size > 2 * 1024 * 1024) {

                toast({
                    title: "Avatar size must be less than 2MB",
                    variant: "destructive",

                })
                return;
            }
            if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                toast({
                    title: "Only jpeg, png, or jpg files are allowed",
                    variant: "destructive",
                })
                return;
            }
            setValue("userAvatarOfTestimonialGiver", e.target?.files?.[0]);
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);

        try {
            const newForm = new FormData();
            newForm.append('userNameOfTestimonialGiver', data.userNameOfTestimonialGiver || "Anonymous User");
            newForm.append('userIntroOfTestimonialGiver', data.userIntroOfTestimonialGiver || 'Hi! I use your app daily');
            newForm.append('message', data.message);
            newForm.append('spaceId', data.spaceId);
            if (data.userAvatarOfTestimonialGiver && data.userAvatarOfTestimonialGiver.length > 0 && data.userAvatarOfTestimonialGiver instanceof File) {
                newForm.append('userAvatarOfTestimonialGiver', data.userAvatarOfTestimonialGiver);
            }

            const res = await axios.post('/api/testimonial', newForm, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === 200) {
                setThankyouName(data.userNameOfTestimonialGiver.split(' ')[0]);
                setShowThankyou(true);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            })
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    if (showThankyou) {
        return <Thankyou userName={thankyouName} projectUrl={testimonialCardData.projectUrl} projectTitle={testimonialCardData.projectTitle} />;
    }

    return (
        <>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                <div className="fixed p-6 top-0 left-0 w-full z-10">
                    <div className="relative inline-flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            {/* <Image src='' width={200} height={200} alt='Genuinely' /> */}
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 relative flex flex-col items-center justify-center min-h-screen max-h-screen overflow-y-auto bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-transparent to-blue-300 opacity-40 blur-3xl" />

                    <div className="relative z-10 flex items-center justify-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={testimonialCardData.projectLogo || defaultProjectLogo} alt="projectLogo" />
                            <AvatarFallback><AvatarImage src={defaultProjectLogo} /></AvatarFallback>
                        </Avatar>
                        <h2 onClick={() => testimonialCardData.projectUrl && window.open(testimonialCardData.projectUrl, '_blank')} className="text-xl font-bold text-blue-600 cursor-pointer hover:underline">
                            {testimonialCardData.projectTitle}
                        </h2>
                    </div>

                    <div className="relative p-6 rounded-3xl flex flex-col shadow-xl border-2 border-blue-500 max-w-md mx-auto bg-white bg-opacity-90">
                        <div className="flex gap-4 text-center">
                            <Avatar className="h-16 w-16 cursor-pointer" onClick={handleAvatarClick}>
                                <AvatarImage src={userAvatarPreview || exampleAvatar} alt="userAvatar" />
                                <AvatarFallback><FcAddImage size={50} /></AvatarFallback>
                            </Avatar>
                            <Input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-700">
                                    <input type="text" className="border-none bg-transparent outline-none p-0 m-0 w-full" placeholder="John Doe" {...register("userNameOfTestimonialGiver")} />
                                    {errors.userNameOfTestimonialGiver && <p className="text-red-500">{errors.userNameOfTestimonialGiver.message}</p>}
                                </h3>
                                <input type="text" className="border-none text-gray-500 bg-transparent outline-none p-0 m-0 w-full" placeholder="CEO at XYZ (optional)" {...register("userIntroOfTestimonialGiver")} />
                            </div>
                        </div>

                        <p className="text-gray-700 font-semibold my-4 text-center">{testimonialCardData.promptText}</p>

                        <Textarea placeholder={testimonialCardData.placeholder} {...register("message")} className="resize-none h-32 w-full px-4 py-2 rounded-2xl border border-blue-400 text-black mb-4" />
                        {errors.message && <p className="text-red-500">{errors.message.message}</p>}

                        <Button className="rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
