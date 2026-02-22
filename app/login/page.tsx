'use client'
import { useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import warning_icon from "@/public/warning_icon.svg";
import { login } from "../library/login";

// TODO: create login page

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, SetError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    // update frontend
    setIsLoading(true);
    SetError(null); // reset previous error

    const loginSuccess = await login(data);

    if (loginSuccess) {
      // TODO: automatically load to main page
      redirect("/");
    } else {
      SetError("Login Error: Please try again.");
    }

    setIsLoading(false);
  }

  return (
    <form action={onSubmit}>
      <input type="text" name="UserName" id=""
        placeholder="Enter User Name"
        className="container bg-amber-50" />
      <input type="password" name="Password" id=""
        placeholder="Enter Password"
        className="container bg-amber-50" />
      <button type="submit" className="container">
        { isLoading ? "..." : "Login"}
      </button>
      <div className={`${error ? 'block' : 'hidden'} container flex flex-row items-center gap-2 bg-amber-200`}>
        <Image src={warning_icon}
          width={25} height={25}
          alt=""/>
        <span>{error ?? ""}</span>
      </div>
    </form>
  );
}
