import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { ScrollArea } from "@/components/ui/scroll-area"
import Search from "@/components/ui/search";
import Testimonials from "./Testimonials";
import { Input } from "@/components/ui/input";
interface Props {
    spaceid: string,
    uniqueLink: string
}

//user types something in search bar 
//query value is updated
//debounced query is making the call to backend so it will be updated after 3 secs


export default function DisplayTestimonials({ spaceid, uniqueLink }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get('query');

    const [query, setQuery] = useState(q ?? '');

    const debounced = useDebounceCallback(setQuery, 500);


    useEffect(() => {
        //taking current search params and forming new params with debounced value and page no and then putting them back in url
        console.log(query);

        const params = new URLSearchParams(searchParams.toString());

        if (query?.trim()) {
            params.set('query', query);
        } else {
            params.delete('query'); // Remove query param when empty
        }

        params.set('page', '1'); // Reset to first page on new search
        router.push(`?${params.toString()}`, { scroll: false });
    }, [query, router, searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounced(e.target.value);
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4">
                <Input placeholder="Search testimonials by name or message..." onChange={handleChange} />
            </div>

            <ScrollArea className="flex-grow rounded-md border p-4">
                <Testimonials
                    query={query}
                    spaceId={spaceid}
                    uniqueLink={uniqueLink}
                />
            </ScrollArea>
        </div>
    )
}