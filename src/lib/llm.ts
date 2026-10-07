import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in .env");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

type GenerateOptions = {
  system: string;
  prompt: string;
  maxTokens?: number;
};

// Returns the FULL answer at once (used for tags)
export async function generateText({
  system,
  prompt,
  maxTokens = 500,
}: GenerateOptions): Promise<string> {
  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens + 2000, // extra room for the model's thinking
    temperature: 0.3,
    reasoning_effort: "low", // think briefly, then answer
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

// Returns the answer PIECE BY PIECE (used for summaries)
export async function* streamText({
  system,
  prompt,
  maxTokens = 500,
}: GenerateOptions): AsyncGenerator<string> {
  const stream = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens + 2000,
    temperature: 0.3,
    reasoning_effort: "low",
    stream: true,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });

  for await (const chunk of stream) {
    const piece = chunk.choices[0]?.delta?.content;
    if (piece) yield piece;
  }
}
