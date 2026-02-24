import axios from "axios"
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

const AUTH_KEY = process.env.RAI_KEY
const base_url = "https://api.chatmdr.eu/v1"

export type ChatReqBody = {
  model: "chatmdr-fast-openai"
  messages: [ { role: "user" | "assistant", content: string } ]
  max_tokens: number
}

export type ChatResBody = {
  object: string
  id: string
  model: "chatmdr-fast-openai"
  created: Timestamp
  choices: [ { index: number, message: { role: "user" | "assistant", content: string } } ]
  usage: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
}

export const postChat = async (reqBody: ChatReqBody): Promise<ChatResBody> => {
  const result: ChatResBody = await axios.post(base_url + '/chat/completions', {
    model: "chatmdr-fast-openai",
    messages: [{
      role: "user",
      content: ""
    }],
    max_tokens: 1024
  }, {
    headers: { "Content-Type": "application/json", "Authorization": AUTH_KEY }
  })
  console.log(result);

  return result
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const blob = await put(`chat-attachments/${Date.now()}-${file.name}`, file, {
      access: 'public', // use 'private' + signed URLs for sensitive data
    });

    return NextResponse.json({
      storage_url: blob.url,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}