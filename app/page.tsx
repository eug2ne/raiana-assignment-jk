// TODO: create a way to temporarily store the dialogue data on the frontend side
// TODO: display TextBox using user message + chat response data
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatField from "./components/ChatField";

export default async function Home() {
  // auth
  const cookieStore = await cookies();
  const authenticated: RequestCookie | undefined = cookieStore.get("Authenticated");

  if (!authenticated) {
    // auth cookie does not exist redirect user to login page
    redirect("/login");
  }

  return (
    <ChatField />
  );
}
