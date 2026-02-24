'use client'
// TODO: create a way to temporarily store the dialogue data on the frontend side
// TODO: display TextBox using user message + chat response data
import { Message } from "../types/chat";
import InputBox from "./InputBox";
import TextBox from "@/app/components/TextBox";
import { useState } from "react";

export default function ChatField() {
  // messages data
  const [messages, setMessages] = useState<Message[]>([]);
  const handleNewMessage = (mesage: Message) => {
    setMessages(prev => [...prev, mesage]);
  }

  return (
    <main className="w-screen h-screen">
        <div className="text-area relative w-5/6 h-3/4 justify-self-center p-1 overflow-y-auto">
            {[...messages.values()].map((m: Message, i: number) => (
                <TextBox key={i} message={m}/>
            ))}
        </div>
        <InputBox onSubmit={handleNewMessage}/>
    </main>
  );
}
