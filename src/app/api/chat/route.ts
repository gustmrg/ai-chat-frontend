import { type CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      system: "You are a helpful assistant.",
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    // Log full error details
    console.error("Error during OpenAI request:", error);

    // Return a more informative error response
    return new Response(
      JSON.stringify({
        message: "An error occurred while processing your request.",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined, // Include stack trace for debugging
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
