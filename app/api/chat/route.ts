import Groq from "groq-sdk";
import { retrieveContext } from "@/lib/knowledge";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

    // RAG: retrieve relevant knowledge
    const context = retrieveContext(message || "");

    const contextText =
      context.length > 0
        ? context
            .map((item) => `${item.topic}: ${item.content}`)
            .join("\n\n")
        : "No specific study material was retrieved.";

    const content: any[] = [
      {
        type: "text",
        text: `
User question: ${message || "Please analyze the image."}

Relevant study material:
${contextText}

Answer the user clearly and simply. Use the relevant study material when useful.
`,
      },
    ];

    if (image) {
      content.push({
        type: "image_url",
        image_url: {
          url: image,
        },
      });
    }

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI Study Assistant. Explain concepts clearly and simply for students.",
        },
        {
          role: "user",
          content,
        },
      ],
      reasoning_effort: "none",
    });

    return Response.json({
      reply:
        completion.choices[0]?.message?.content ||
        "No response received.",
    });
  } catch (error) {
    console.error("Groq error:", error);

    return Response.json(
      { error: "Failed to get response from Groq." },
      { status: 500 }
    );
  }
}