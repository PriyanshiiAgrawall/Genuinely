import { TestimonialInterface } from "@/models/Testimonial";

export interface ApiResponse {
    status?: number,
    success: boolean,
    message: string,
    testimonials?: TestimonialInterface[],
    id?: string,

}