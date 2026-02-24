import { Message } from "../types/chat";

const TextBox = (props: { message: Message }) => {
  return (
    <div className={`container text-box w-fit min-w-70 max-w-120 m-4 ${ props.message.role === "user" ? "justify-self-end bg-amber-100" : "justify-self-start bg-amber-200" }`}>
      <p>
        { props.message.content }
      </p>
    </div>
  )
}

export default TextBox;