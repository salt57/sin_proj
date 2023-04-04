import React from "react";
import MessageBox from "./MessageBox/MessageBox";
import Messages from "./Messages/Messages";
import useChat from "./useChat";

const Chat = (currentUserData) => {
  // console.log(currentUserData.currentUserData.role)
  const { messages, sendMessage } = useChat(
    currentUserData.currentUserData
  );
  return (
    <div>
      <Messages messages={messages} />
      <MessageBox
        userData={currentUserData}
        onSendMessage={(message) => {
          sendMessage(message);
        }}
      />
    </div>
  );
};

export default Chat;
