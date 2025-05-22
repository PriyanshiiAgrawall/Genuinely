import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

async function run(projectName: string, feedbackPrompt: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Generate 5 short and polite customer testimonials for a project/topic called "${projectName}" based on this feedback: "${feedbackPrompt}".Some should have project name some not some with constructive criticism some too polite.`
        const result = await model.generateContent(prompt);
        if (!result.response || !result.response.candidates) {
            throw new Error("Invalid AI response");
        }
        return result.response.candidates.map((c: any) => c.content.parts[0].text);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return ["Error generating suggestions. Please try again."];
    }

}
export async function POST(req: Request) {
    const { projectName, feedbackPrompt } = await req.json();

    if (!projectName || !feedbackPrompt) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const data = await run(projectName, feedbackPrompt);
        return NextResponse.json({ suggestions: data }, { status: 200 });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }
}


