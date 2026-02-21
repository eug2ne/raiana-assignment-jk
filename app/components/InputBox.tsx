'use client'
import React from "react";
import Image from "next/image";
import file_icon from "@/public/file_icon.svg";
import submit_icon from "@/public/submit_icon.svg";

const submitForm = () => {
  console.log("submit form")
  // TODO: create submit function (make post request to ChatMDR API)
}

const InputBox = () => {
  return (
    <form action=""
      className="container input-box flex-row sticky bottom-0 w-{90%} align-top self-center">
      <textarea name="message" id="" required={true}
        className="container"
        defaultValue="Paste your text here or upload your pdf file."
      />
      <ul className="flex-row">
        <button type="button" className="bg-amber-50">
          <Image src={file_icon}
            width={20}
            height={20}
            alt=""/>
        </button>
        <button type="submit" className="bg-amber-50">
          <Image src={submit_icon}
            width={25}
            height={25}
            alt=""/>
        </button>
      </ul>
    </form>
  )
}

export default InputBox;