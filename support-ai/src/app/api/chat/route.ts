import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();
    if (!message || !ownerId) {
      return NextResponse.json(
        {
          message: "Message and OwnerId Required!",
        },
        { status: 400 },
      );
    }
    await connectDb()
    const setting = await Settings.findOne({ownerId})
    if(!setting){
        return NextResponse.json(
            {message: "chat bot is not configured yet!"},
            {status: 400}
        )
    }

    const KNOWLEDGE =`
      business name- ${setting.businessName || "not provided"}
      support email- ${setting.supportEmail || "not provided"}
      knowledge- ${setting.knowledge || "not provided"}
    ` 

    const prompt = `
     You are a professional customer support assistant for this business.

     Use ONLY the information provided below to answer the customer's question.
     You may rephrase, summarize, or interpret the information if needed.
     Do NOT invent new policies, prices, or promises.

     If the customer's question is completely unrelated to the information, 
     or cannot be reasonably answered from it, reply exactly with:
     "Please contact support.'

     --------------------
     BUSINESS INFORMATION
     --------------------
     ${KNOWLEDGE}

     -------------------
     CUSTOMER QUESTION
     -------------------
     ${message}
    
     -------------------
     ANSWER
     -------------------
    `

    const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
     const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
    });
    
    return NextResponse.json(response.text)


  } catch (error) {
    return NextResponse.json(
            {message: `chat Error ${error}`},
            {status: 500}
        )
  }
}
