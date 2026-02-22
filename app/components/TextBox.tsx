import { Message } from "../api/chatmdr";

// TODO: apply different styles for user, assistant message

const TextBox = (props: { message: Message }) => {
  return (
    <p className={`container text-box w-fit min-w-70 max-w-160 m-4 ${ props.message.role === "user" ? "justify-self-end bg-amber-100" : "justify-self-start bg-amber-200" }`}>
      { props.message.content }
    </p>
  )
}

export default TextBox;