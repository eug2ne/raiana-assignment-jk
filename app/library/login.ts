'use server'
import { cookies } from "next/headers";

export const login = async (data: FormData): Promise<boolean> => {
  const userName = data.get("UserName");
  const password = data.get("Password");

  if (userName === process.env.AUTH_USER && password === process.env.AUTH_PW) {
    // set cookie session data
    const cookieStore = await cookies();
    cookieStore.set("Authenticated", "true");
    
    return true;
  } else {
    return false;
  }
}