import React, { useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import "./MessageBox.css";

//renaming prop for use in the component
const MessageBox = (props) => {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const messageRef = useRef("");
  const roleRef = useRef("");

  const sendMessageClick = () => {
    if (
      messageRef.current.value === "" ||
      roleRef.current.value === ""
    ) {
      return false;
    }
    const messageObject = {
      user_name: props.userData.currentUserData.user_name,
      password: props.userData.currentUserData.password,
      user_avatar:
        props.userData.currentUserData.user_avatar,
      intent_role: roleRef.current.value,
      message: messageRef.current.value,
    };
    props.onSendMessage(messageObject);
    setMessage("");
    setRole("");
  };

  return (
    <div className="contain">
      <form className="chat-form" autoComplete="off">
        <TextField
          InputProps={{
            style: {
              color: "white",
              marginLeft: "2rem",
              width: "90%",
            },
          }}
          id="standard-basic"
          label="Type your message here"
          margin="normal"
          multiline
          fullWidth
          inputRef={messageRef}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              //prevents enter from being pressed
              event.preventDefault();
              sendMessageClick();
            }
          }}
          value={message}
        />
        <TextField
          InputProps={{
            style: {
              color: "white",
              marginLeft: "2rem",
              width: "90%",
            },
          }}
          id="standard-basic"
          label="Type role intended for the message, any for all roles"
          margin="normal"
          multiline
          fullWidth
          rows="1"
          inputRef={roleRef}
          onChange={(event) => setRole(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              //prevents enter from being pressed
              event.preventDefault();
              sendMessageClick();
            }
          }}
          value={role}
        />
        <Button
          style={{ marginTop: "10px", marginLeft: "2rem" }}
          variant="contained"
          color="primary"
          onClick={sendMessageClick}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default MessageBox;
