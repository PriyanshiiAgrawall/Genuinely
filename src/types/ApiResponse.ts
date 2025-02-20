import { TestimonialInterface } from "@/models/Testimonial";

export interface ApiResponse {
    status?: number,
    success: boolean,
    message: string,
    isAcceptingTestimonials?: boolean,
    testimonials?: TestimonialInterface[],
    id?: string,

}