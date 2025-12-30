import { NextResponse } from "next/server";

type GeminiRequest = {
  apiKey: string;
  imageDataUrl: string;
};

type GeminiCandidate = {
  content?: {
    parts?: Array<{ text?: string }>;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeminiRequest;
    const { apiKey, imageDataUrl } = body;

    if (!apiKey || !imageDataUrl) {
      return NextResponse.json(
        { error: "Missing apiKey or imageDataUrl." },
        { status: 400 }
      );
    }

    const match = imageDataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid image data format." },
        { status: 400 }
      );
    }

    const mimeType = match[1];
    const base64Data = match[2];

    const prompt = [
      "You are reading a teacher timetable image.",
      "Extract a weekly schedule for Monday to Friday.",
      "Return ONLY valid JSON with this shape:",
      "{",
      '  "schedule": {',
      '    "monday": [{ "title": "", "time": "", "location": "", "type": "class|meeting|reset" }],',
      '    "tuesday": [],',
      '    "wednesday": [],',
      '    "thursday": [],',
      '    "friday": []',
      "  }",
      "}",
      "Use 24h or AM/PM times exactly as seen.",
      "Use type = class for subjects, meeting for admin/meet/assembly, reset for breaks.",
      "If a field is unknown, use an empty string.",
    ].join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Gemini request failed.", details: errorText },
        { status: response.status }
      );
    }

    const data = (await response.json()) as { candidates?: GeminiCandidate[] };
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
