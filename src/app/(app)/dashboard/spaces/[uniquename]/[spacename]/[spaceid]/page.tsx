"use client"

import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Unauthorized from "@/app/components/Unauthorized";
import TestimonialCardForm from "./components/TestimonialCardForm";
import DisplayTestimonials from "./components/DisplayTestimonial";
import LoveGallery from "./components/LoveBook";
import Navbar1 from "@/app/components/Navbar1";
import Navbar from "@/app/(app)/dashboard/components/Navbar";
// import LoveGallery from "@/components/LoveGallery"; ->  LoveGalleryCustomizer -> RealTimeLoveGallery




export default function UserSpacePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const uniquename = params.uniquename;
    const spacename = params.spacename;
    const spaceid = params.spaceid as string;
    const [unauthorized, setunauthorized] = useState(false);
    const [isNewSpace, setIsNewSpace] = useState(false);
    const [uniqueLink, setUniqueLink] = useState('');
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/sign-in");
        setLoading(true);

        async function fetchData() {
            try {

                const response = await axios(`/api/space?spaceId=${spaceid}`);

                console.log(spaceid);
                const space = response.data.spaces[0];
                console.log(space)

                if (response.status === 200) {

                    setIsNewSpace(space.isNewSpace || false);

                    setUniqueLink(space.uniqueLink || '');
                    console.log(uniqueLink);

                }
                else {

                    setunauthorized(true);
                    console.error(response.data.message);

                    toast({
                        title: "Space Fetching Error",
                        description: response?.data?.message || "An unexpected error occurred",
                        variant: "destructive",
                    })
                }



            }

            catch (error) {

                toast({
                    title: "Space Fetching Error",
                    description: "An unexpected error occurred",
                    variant: "destructive",
                })
            }

            finally {
                setLoading(false);
            }

        }

        if (session) {
            fetchData();
        }


    }, [session, status, spaceid]);

    useEffect(() => {
        if (isNewSpace) {
            setIsUpdate(false);
        } else {
            setIsUpdate(true);
        }
    }, [isNewSpace]);

    if (status === "loading") return <p>Loading...</p>;

    if (loading) return <p>Loading space data...</p>;

    if (unauthorized) {
        return <Unauthorized />;
    }





    return (
        <div><div className="mb-16">
            <Navbar />
        </div>
            <br></br>


            <Tabs defaultValue="Testimonials" className="">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="Testimonials" className="">Testimonials</TabsTrigger>
                    <TabsTrigger value="Card">Testimonial Form</TabsTrigger>
                    <TabsTrigger value="loveGallery">Love Gallery</TabsTrigger>
                </TabsList>

                <TabsContent className="" value="Testimonials">
                    <Card>
                        <CardHeader>
                            <CardTitle>Testimonials Received</CardTitle>
                            <CardDescription>
                                These are the testimonials received for this space. If you don&apos;t see any please reload the page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <DisplayTestimonials uniqueLink={uniqueLink} spaceid={spaceid} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="Card">
                    <Card>
                        <CardHeader>
                            <CardTitle>Testimonial Form</CardTitle>
                            <CardDescription>
                                This is your testimonial form Card for this space. Update the form as needed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">

                            {isUpdate ? <TestimonialCardForm isUpdate={true} spaceId={spaceid ?? ""} uniqueLink={uniqueLink} /> : <TestimonialCardForm isUpdate={false} spaceId={spaceid ?? ""} uniqueLink={uniqueLink} />}

                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="loveGallery">
                    <Card>
                        <CardContent>
                            <LoveGallery spaceId={spaceid} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}