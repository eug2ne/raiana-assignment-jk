'use client'
import Image from "next/image";
import file_icon from "@/public/file_icon.svg";
import submit_icon from "@/public/submit_icon.svg";

const submitForm = (data: FormData) => {
  console.log(data);
  // TODO: create submit function (make post request to ChatMDR API)
}

const InputBox = () => {
  return (
    <form action={submitForm}
      className="container input-box flex flex-row sticky bottom-0 w-{90%} justify-center justify-self-center self-bottom">
      <textarea name="message" id="" required={true}
        className="container bg-amber-50 max-w-140 min-h-40"
        placeholder="Paste your text here or upload your pdf file."
      />
      <ul className="flex flex-row gap-1 m-2">
        <button type="button" className="bg-amber-50 h-fit">
          <Image src={file_icon}
            width={20}
            height={20}
            alt=""/>
        </button>
        <button type="submit" className="bg-amber-50 h-fit">
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