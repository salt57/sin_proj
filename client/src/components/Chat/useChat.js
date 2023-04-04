import { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";

const useChat = (data) => {
  // console.log(data);
  const socketRef = useRef();
  const [messages, setMessages] = useState([]);

  //when component mounts and changes
  useEffect(() => {
    socketRef.current = socketIOClient(
      "http://localhost:5001"
    );

    // socketRef.current.emit("mostRecentMessages", data);

    socketRef.current.on(
      "mostRecentMessages",
      (mostRecentMessages) => {
        console.log("most recent messages encrypted: ", mostRecentMessages)
          fetch("http://localhost:5002/api/decode", {
            method: "POST",
            body: JSON.stringify({
              username: data.user_name,
              messages: [...mostRecentMessages].filter(
                (msg) =>
                  msg.intent_role === data.role ||
                  msg.intent_role === "any"
              ),
              role: data.role,
            }),
            headers: {
              "Content-type":
                "application/json; charset=UTF-8",
            },
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              console.log(data);
              setMessages(data.messages);
              if (!data.success) {
                return;
              }
            })
            .catch((error) =>
              console.error("Error:", error)
            )
        // setMessages(
        //   [...mostRecentMessages].filter(
        //     (msg) =>
        //       msg.intent_role === data.role ||
        //       msg.intent_role === "any"
        //   )
        // );
      }
    );

    socketRef.current.on(
      "newChatMessage",
      ({
        user_name,
        user_avatar,
        intent_role,
        message_text,
      }) => {
        console.log("new message: ", message_text, "for role: ", intent_role);
        if (
          intent_role === data.role ||
          intent_role === "any"
        ) {
          fetch("http://localhost:5002/api/decode", {
            method: "POST",
            body: JSON.stringify({
              username: data.user_name,
              messages: [
                {
                  user_name,
                  message_text,
                  intent_role,
                },
              ],
              role: data.role,
            }),
            headers: {
              "Content-type":
                "application/json; charset=UTF-8",
            },
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              console.log(data);
              setMessages((messages) => [
                ...messages,
                {
                  user_name: data.messages[0].user_name,
                  user_avatar: user_avatar,
                  intent_role: data.messages[0].intent_role,
                  message_text:
                    data.messages[0].message_text,
                },
              ]);
              if (!data.success) {
                return;
              }
            })
            .catch((error) =>
              console.error("Error:", error)
            );
        }
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = (messageObject) => {
    socketRef.current.emit("newChatMessage", messageObject);
  };
  // socketRef.current.emit("mostRecentMessages", data);

  return { messages, sendMessage };
};

export default useChat;
