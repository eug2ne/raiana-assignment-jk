import axios from "axios"
import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

const AUTH_KEY = process.env.RAI_KEY
const base_url = "https://api.chatmdr.eu/v1"

export type Message = {
  role: string
  content: string
}

export type ChatReqBody = {
  model: string
  messages: [ Message ]
  max_tokens: number
}

export type ChatResBody = {
  object: string
  id: string
  model: string
  created: Timestamp
  choices: [ { index: number, message: Message } ]
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