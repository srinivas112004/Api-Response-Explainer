import { NextRequest } from "next/server";

export const runtime = "edge";

type ExplainRequest = {
  json?: unknown;
  mode?: "beginner" | "technical";
};

async function* OllamaStreamParser(reader: ReadableStreamDefaultReader) {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i];
      try {
        const json = JSON.parse(line);
        if (json.response) {
          yield json.response;
        }
      } catch (e) {
        
      }
    }
    buffer = lines[lines.length - 1];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExplainRequest;
    const { json: payload, mode } = body;

    const jsonStr = JSON.stringify(payload, null, 2);
    const prompt = `You are a helpful tutor. Explain the following JSON for a ${mode} audience.\n\nRules:\n- Go key by key, one bullet per line: <path> → <value> — <explanation>.\n- Show data type in parentheses after the value.\n- For nested objects, use dot paths (e.g., user.address.city).\n- For arrays, say how many items and a short example.\n- Be concise.\n\nJSON to explain:\n${jsonStr}`;

    const res = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt,
        stream: true,
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error(`Ollama error: ${await res.text()}`);
    }

    const reader = res.body.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        const parser = OllamaStreamParser(reader);
        for await (const chunk of parser) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    });

  
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
    
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message }), { status: 500 });
  }
}