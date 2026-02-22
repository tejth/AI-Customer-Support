import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();

    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "Message and OwnerId Required!" },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDb();
    const setting = await Settings.findOne({ ownerId });

    if (!setting) {
      return NextResponse.json(
        { message: "Chat bot is not configured yet!" },
        { status: 400, headers: corsHeaders }
      );
    }

    const KNOWLEDGE = `
      business name- ${setting.businessName || "not provided"}
      support email- ${setting.supportEmail || "not provided"}
      knowledge- ${setting.knowledge || "not provided"}
    `;

    const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below to answer the customer's question.
Do NOT invent new policies, prices, or promises.

If unrelated, reply exactly with:
"Please contact support."

BUSINESS INFO:
${KNOWLEDGE}

CUSTOMER QUESTION:
${message}

ANSWER:
`;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json(result.text, {
     headers: corsHeaders
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Chat Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}