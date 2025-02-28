'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';
import { FcAddImage } from 'react-icons/fc';
import { CircleCheck, Copy } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useParams, useRouter } from 'next/navigation';
import { defaultProjectLogo } from '@/helpers/project-logo-generator';
import { exampleAvatar } from '@/helpers/avatar-generator';
import { makeSpaceOld } from '@/app/actions/spaces';

function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType === "png" || fileType === "jpeg" || fileType === "jpg") return true;
    }
    return false;
}


const avatarSchema = z
    .any()
    .refine((file) => file instanceof File, "Invalid file type.")
    .refine((file) => file.size < 2000000, "File size must be under 2MB.");


const testimonialCardSchemaZod = z.object({
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



//whichever props gets here are validated first
interface Props {
    isUpdate: boolean;
    spaceId: string;
    setIsNewSpace?: React.Dispatch<React.SetStateAction<boolean>>;
    uniqueLink?: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function TestimonialCardForm({ isUpdate, spaceId, setIsNewSpace, uniqueLink }: Props) {
    const { spacename } = useParams();
    const { uniquename } = useParams();
    const { toast } = useToast();
    const router = useRouter();
    const [logoPreview, setLogoPreview] = useState<string>(defaultProjectLogo);
    const [copied, setCopied] = useState(false);

    // if data is returned from this call then update is needed a card is alredy present in db otherwise new card will be saved 
    console.log(isUpdate)
    const { data } = useSWR(
        isUpdate ? `/api/testimonial-card?spaceId=${spaceId}` : null,
        fetcher,
        { revalidateOnFocus: false }
    );
    if (data) {
        console.log(data);
    }

    const testimonialForm = data?.testimonialForm;


    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        watch,
        formState: { errors, isDirty, isSubmitting },
    } = useForm({
        resolver: zodResolver(testimonialCardSchemaZod),
        defaultValues: {
            projectTitle: testimonialForm?.projectTitle || 'Your New Project',
            projectUrl: testimonialForm?.projectUrl || 'https://example.com',
            promptText: testimonialForm?.promptText || 'Sharing my experience so far!',
            placeholder: testimonialForm?.placeholder || 'Share, how did you like our services?',
            projectLogo: testimonialForm?.projectLogo || defaultProjectLogo,
        },
    });

    const projectLogo = watch('projectLogo');

    // Populate form when data is fetched (for update)
    useEffect(() => {
        if (testimonialForm) {
            const { projectTitle, projectUrl, promptText, placeholder, projectLogo } = testimonialForm;

            reset({ projectTitle, projectUrl, promptText, placeholder, projectLogo });

            setLogoPreview(projectLogo || defaultProjectLogo);
        }
    }, [testimonialForm, reset]);

    // File upload preview handler
    useEffect(() => {
        if (projectLogo instanceof File) {
            const logoURL = URL.createObjectURL(projectLogo);
            setLogoPreview(logoURL);
            return () => URL.revokeObjectURL(logoURL);
        }
    }, [projectLogo]);

    const onSubmit = async (formData: any) => {
        //for backend api we need spaceId and spaceName to be send in formdata hence appending that
        console.log("hereeeee")
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) {
                if (value instanceof File) {
                    form.append(key, value); // For file uploads
                } else if (typeof value === 'string') {
                    form.append(key, value); // For strings
                } else {
                    form.append(key, JSON.stringify(value)); // Convert objects/arrays to string
                }
            }
        });
        form.append('spaceId', spaceId);
        form.append('spaceName', typeof spacename === 'string' ? spacename : '');

        try {
            if (isUpdate) {
                console.log("update vala")
                await axios.put('/api/testimonial-card', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });


                toast({
                    title: "Form updated successfully",
                })
                makeSpaceOld(spaceId);
                router.refresh();

            } else {

                await axios.post('/api/testimonial-card', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                toast({
                    title: "Form submitted successfully",

                })
            }
        } catch (error: any) {


            toast({
                title: 'Please Try Again',
                description: "Something went wrong while saving details",
                variant: "destructive",
            })
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files)
        const file = e.target.files?.[0];
        if (file) {
            try {
                if (file.size > 2 * 1024 * 1024) {


                    toast({
                        title: 'File Limit Exceeded',
                        description: "File size should be less than 2MB",
                        variant: "destructive",
                    })
                    return;
                }
                if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                    toast({
                        title: 'Invalid File Format',
                        description: "Only jpeg, png, or jpg files are allowed",
                        variant: "destructive",
                    })
                    return;
                }
                avatarSchema.parse(file);
                setValue('projectLogo', file, { shouldDirty: true });
            } catch (error) {
                if (error instanceof z.ZodError) {
                    toast({
                        title: "Type Error",
                        description: error.errors[0].message,
                        variant: "destructive",
                    })
                }
            }
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(uniqueLink as string);
            setCopied(true);

            toast({
                title: "'Link copied to clipboard'",

            })
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            toast({
                title: "Failed to copy",
                variant: "destructive",
            })
        }
    };
    const projectUrlHere = watch('projectUrl');

    return (
        <div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                    <h2 className="text-xl text-center font-semibold mb-4">Customization</h2>

                    <Label>Project Title</Label>
                    <Input {...register('projectTitle')} />
                    {errors.projectTitle && <p className="text-red-500">{errors.projectTitle.message}</p>}

                    <Label>Project URL</Label>
                    <Input {...register('projectUrl')} />
                    {errors.projectUrl && <p className="text-red-500">{errors.projectUrl.message}</p>}

                    <Label>Project Logo</Label>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={logoPreview} />
                            <AvatarFallback><FcAddImage size={50} /></AvatarFallback>
                        </Avatar>
                        <Button variant="outline" onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('projectLogo')?.click()
                        }}>
                            {isUpdate ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                    </div>
                    <input id="projectLogo" type="file" hidden onChange={handleFileChange} />

                    <Label>Prompt Text</Label>
                    <Textarea {...register('promptText')} />
                    {errors.promptText && <p className="text-red-500">{errors.promptText.message}</p>}

                    <Label>Placeholder</Label>
                    <Textarea {...register('placeholder')} />
                    {errors.placeholder && <p className="text-red-500">{errors.placeholder.message}</p>}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : isUpdate ? 'Update' : 'Submit'}
                    </Button>
                </div>

                <div className="border rounded-md p-4">
                    {isUpdate && (
                        <div className="bg-gray-100 flex flex-col md:flex-row justify-between items-center p-4 rounded-md mb-4 gap-4">

                            <div className="flex items-center justify-between w-full md:w-auto gap-2 bg-white p-2 rounded-md shadow-sm border border-gray-300">
                                <code className="break-all text-sm truncate max-w-[250px] md:max-w-none">{uniqueLink}</code>
                                <Button onClick={copyToClipboard} variant="outline" className="shrink-0">
                                    {copied ? <CircleCheck /> : <Copy />}
                                </Button>
                            </div>


                            <div className="justify-center w-full">
                                <QRCodeGenerator url={uniqueLink as string} />
                            </div>
                        </div>
                    )}


                    <div className="border rounded-md p-4">
                        <h2 className="text-xl font-semibold text-center mb-4  cursor-pointer underline" onClick={() => window.open(uniqueLink, '_blank')}>Live Form Preview</h2>

                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={logoPreview || defaultProjectLogo} alt="Project Logo" />
                            </Avatar>
                            <h2
                                onClick={() => window.open(projectUrlHere, '_blank')}
                                className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
                            >
                                {watch('projectTitle')}

                            </h2>

                        </div>

                        <div className="relative p-6 rounded-3xl flex flex-col shadow-xl border-2 border-blue-500 max-w-md mx-auto bg-white bg-opacity-90">
                            <div className="flex gap-4 text-center">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={exampleAvatar} alt="User Avatar" />
                                </Avatar>
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-700">
                                        {"Anonymous User"}
                                    </h3>
                                    <p className="text-gray-500">{"Hi! I use your app daily"}</p>
                                </div>
                            </div>

                            <p className="text-gray-700 font-semibold my-4 text-center">
                                {watch('promptText') || "Sharing my experience so far!"}
                            </p>

                            <Textarea
                                placeholder={watch('placeholder') || "Share, how did you like our services?"}
                                className="resize-none h-32 w-full px-4 py-2 rounded-2xl border border-blue-400 text-black mb-4"
                                disabled
                            />

                            <Button className="rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-6">
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default TestimonialCardForm;
