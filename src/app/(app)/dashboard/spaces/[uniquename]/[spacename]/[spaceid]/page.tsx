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





export default function UserSpacePage() {

    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const uniquename = params.uniquename;
    const spacename = params.spacename;
    const spaceid = params.spaceid;
    const [unauthorized, setunauthorized] = useState(false);
    const [isNewSpace, setIsNewSpace] = useState(false);
    const [uniqueLink, setUniqueLink] = useState('');
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) router.push("/login");
        setLoading(true);

        async function fetchData() {
            try {
                const response = await axios(`/api/space?spaceId=${spaceid}`);
                const space = response.data.spaces;
                console.log(response);
                if (response.status === 200) {
                    setIsNewSpace(space.isNewSpace || false);
                    setUniqueLink(space.uniqueLink || '');

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
                // console.log(space);createdAt
                // : 
                // "2025-02-22T23:17:03.327Z"
                // name
                // : 
                // "jello"
                // owner
                // : 
                // "67b8a7b4a6ffb08de226f4ad"
                // testimonials
                // : 
                // []
                // testimonialsCount
                // : 
                // 0
                // uniqueLink
                // : 
                // "http://localhost:3000/jello/priyanshi666"
                // __v
                // : 
                // 0
                // _id
                // : 
                // "67ba5aef544e71545bdc54ed"


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
            if (session) {
                fetchData();
            }
        }


    }, [session, status, spaceid]);

    if (status === "loading") return <p>Loading...</p>;

    if (loading) return <p>Loading space data...</p>;

    if (unauthorized) {
        return <Unauthorized />;
    }

    if (isNewSpace) {
        return (
            <TestimonialCardForm
                isUpdate={false}
                spaceId={spaceid}
                setIsNewSpace={setIsNewSpace}
            />
        );
    }


    return (
        <div>
            <Button variant="link" className="text-blue-500">
                <Link href="/dashboard">
                    <MoveLeft className="h-6 w-6 inline" /> Dashboard
                </Link>
            </Button>

            <Tabs defaultValue="Testimonials" className="">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="Testimonials">Testimonials</TabsTrigger>
                    <TabsTrigger value="Card">Testimonial Form</TabsTrigger>
                    <TabsTrigger value="loveGallery">Love Gallery</TabsTrigger>
                </TabsList>

                <TabsContent value="Testimonials">
                    <Card>
                        <CardHeader>
                            <CardTitle>Testimonials Received</CardTitle>
                            <CardDescription>
                                These are the testimonials received for this space.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <DisplayTestimonials uniqueLink={uniqueLink} params={params} />
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
                            <TestimonialCardForm isUpdate={true} spaceId={spaceid} uniqueLink={uniqueLink} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="loveGallery">
                    <Card>
                        <CardContent>
                            <LoveGallery />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}