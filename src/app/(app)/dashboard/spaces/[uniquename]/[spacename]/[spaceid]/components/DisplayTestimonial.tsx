import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks";
import { ScrollArea } from "@/components/ui/scroll-area"
import Search from "@/components/ui/search";
import Testimonials from "./Testimonials";
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
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [debouncedQuery] = useDebounce(query, 300);

    const handleSearch = useCallback((newQuery: string) => {
        setQuery(newQuery)
    }, [])

    useEffect(() => {
        //taking current search params and forming new params with debounced value and page no and then putting them back in url
        const params = new URLSearchParams(searchParams.toString())
        params.set('query', debouncedQuery)
        params.set('page', '1') // Reset to first page on new search
        router.push(`?${params.toString()}`, { scroll: false })
    }, [debouncedQuery, router, searchParams])

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4">
                <Search placeholder="Search testimonials by name or message..." onSearch={handleSearch} />
            </div>

            <ScrollArea className="flex-grow rounded-md border p-4">
                <Testimonials
                    query={debouncedQuery}
                    spaceId={spaceid}
                    uniqueLink={uniqueLink}
                />
            </ScrollArea>
        </div>
    )
}