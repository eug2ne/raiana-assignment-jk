import React from "react";
import { Message } from "../api/chatmdr";

// TODO: apply different styles for user, assistant message

const TextBox = (message: Message) => {
  return (
    <div className="container text-box">
      <p>{ message.content }</p>
    </div>
  )
}

export default TextBox;