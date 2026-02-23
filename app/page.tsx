// TODO: create a way to temporarily store the dialogue data on the frontend side
// TODO: display TextBox using user message + chat response data
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Message } from "./api/chatmdr";
import TextBox from "./components/TextBox";
import InputBox from "./components/InputBox";
import { useState } from "react";

export default async function Home() {
  // auth
  const cookieStore = await cookies();
  const authenticated: RequestCookie | undefined = cookieStore.get("Authenticated");

  if (!authenticated) {
    // auth cookie does not exist redirect user to login page
    redirect("/login");
  }

  // messages data
  const [messages, SetMessages] = useState([]);
  const handleSubmit = (new_m: Message): void => {
    // FIXME: how to add new_m to messages data
    SetMessages([]);
  }

  return (
    <main className="w-screen h-screen">
      <div className="text-area relative w-5/6 h-3/4 justify-self-center p-1 overflow-y-auto">
        {messages.map((m: Message, i: number) => (
          <TextBox key={i} message={m}/>
        ))}
      </div>
      <InputBox onSubmit={handleSubmit} />
    </main>
  );
}
