"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { CircleCheck, Copy } from "lucide-react";
// const mockSuggestions = [
//     "The Data Migration Project had some challenges, but improvements can be made.",
//     "While the outcome wasn't ideal, we appreciate the team's migration efforts.",
//     "We faced a few bumps in the data migration—better planning might have helped.",
//     "The migration process was... an experience. We're working through some issues.",
//     "We encountered unforeseen difficulties. Hoping for better results next time."
// ];
export default function AISuggestion({ testimonialCardDataObj }: { testimonialCardDataObj: any }) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [prompt, setPrompt] = useState("");
    const { toast } = useToast();
    const fetchSuggestions = async () => {
        setLoading(true);
        try {

            if (!prompt.trim()) return;

            const response = await fetch("/api/ai-suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectName: testimonialCardDataObj.projectTitle,
                    feedbackPrompt: prompt,
                }),
            });
            const data = await response.json();
            const formattedSuggestions = data.suggestions[0]?.split("\n").map((s: string) => s.trim()).filter((s: string) => s) || [];
            setSuggestions([]);
            setSuggestions(formattedSuggestions || []);




        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    // const fetchMockSuggestions = () => {
    //     setSuggestions(mockSuggestions); 
    // };

    const copyToClipboard = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            toast({
                title: 'Prompt copied to clipboard'
            })
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            toast({
                title: 'Failed to copy link',
                variant: "destructive",
            })
        }
    };
    function clearSuggestions() {
        setLoading(true);
        try {
            setSuggestions([]);
            setPrompt("");

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl mx-auto p-6 mt-10 bg-[#272E3F] rounded-xl shadow-lg"
            >
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-xl font-bold mb-4 text-gray-200 text-center"
                >
                    Ask AI!
                </motion.h1>
                <div className="flex flex-col gap-2">
                    <Input
                        type="text"
                        placeholder="Enter a few words..."
                        value={prompt}
                        disabled={false}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-2 border border-gray-700 rounded-lg bg-gray-600 text-white"
                    />
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            onClick={fetchSuggestions}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                            {loading ? 'Generating...' : 'Get AI Suggestions'}
                        </Button>
                        <Button
                            onClick={clearSuggestions}
                            disabled={loading}
                            className="bg-gray-400 hover:bg-gray-200 transition duration-300 ease-in-out text-gray"
                        >
                            {'Clear Suggestions'}
                        </Button>
                    </div>
                </div>
                <ul className="mt-4 text-gray-200">
                    {suggestions.map((s, index) => (
                        <span key={index} className="flex flex-row">
                            <motion.li
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                className="border border-gray-700 p-3 rounded-lg my-2 bg-gray-800 shadow-md"
                            >
                                {s}
                            </motion.li>
                            <Button
                                onClick={() => copyToClipboard(s, index)}
                                className={`inline ml-4 mt-8 rounded-md focus:outline-none transition-colors duration-200 px-4 py-2 ${copiedIndex === index ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                    }`}
                            >
                                {copiedIndex === index ? (
                                    <CircleCheck className="w-4 h-4 text-white" />
                                ) : (
                                    <Copy className="w-4 h-4 text-white" />
                                )}
                            </Button>
                        </span>
                    ))}
                </ul>

            </motion.div>
        </div>
    );
}
