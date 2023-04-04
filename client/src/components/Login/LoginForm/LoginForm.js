import React, { useRef, useState } from "react";
import {
  TextField,
  Fab,
  Button,
  InputLabel,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Loader from "react-loader-spinner";
import axios from "axios";

import "./LoginForm.css";

const LoginForm = ({ setUserDataForChat }) => {
  const [loading, setLoading] = useState(false);
  const userNameInput = useRef("");
  const passwordInput = useRef("");
  const userNameLoginInput = useRef("");
  const passwordLoginInput = useRef("");
  const roleInput = useRef("");
  // const imageInput = useRef("");

  const enterChatClick = () => {
    fetch("http://localhost:5002/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: userNameLoginInput.current.value,
        password: passwordLoginInput.current.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        if (!data.success) {
          return;
        }
        setUserName(
          userNameLoginInput.current.value,
          passwordLoginInput.current.value,
          data.role
          // imageInput.current.files[0]
        );
      })
      .catch((error) => console.error("Error:", error));
  };
  const signup = () => {
    // console.log(userNameInput.current);
    fetch("http://localhost:5002/api/register", {
      method: "POST",
      body: JSON.stringify({
        username: userNameInput.current.value,
        password: passwordInput.current.value,
        role: roleInput.current.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        setUserName(
          userNameInput.current.value,
          passwordInput.current.value,
          roleInput.current.value
          // imageInput.current.files[0]
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  const sendData = async (options) => {
    return await axios.post(
      "http://localhost:5002/api/upload",
      options
    );
  };
  const getAvatar = async (options) => {
    return await axios.post(
      "http://localhost:5002/api/getAvatar",
      options
    );
  };

  const setUserName = (
    userName,
    // imageFile,
    password,
    role
  ) => {
    if (userName === "" || password === "" || role === "") {
      return false;
    }
    // if (imageFile === undefined) {
    // setLoading(true);
    // const data = new FormData();
    // data.append("userName", userName);
    // data.append("password", password);
    // try {
    //   getAvatar(data)
    //     .then((response) => {
    setUserDataForChat({
      user_name: userName,
      // user_avatar: response.data.user_avatar_url,
      password: password,
      role: role,
    });
    //     })
    //     .catch((error) => {
    //       alert(error);
    //     })
    //     .finally(() => setLoading(false));
    // } catch (e) {}
    // } else {
    //   setLoading(true);
    //   const data = new FormData();
    //   data.append("avatar", imageFile);
    //   // data.append("userName", userName);
    //   // data.append("password", password);
    //   try {
    //     sendData(data)
    //       .then((response) => {
    //         setUserDataForChat({
    //           user_name: userName,
    //           user_avatar: response.data.user_avatar_url,
    //           password: password,
    //           role: role,
    //         });
    //       })
    //       .catch((error) => {
    //         alert(error);
    //       })
    //       .finally(() => setLoading(false));
    //   } catch (e) {}
    // }
  };

  return loading ? (
    <Loader
      type="ThreeDots"
      color="#2BAD60"
      height={100}
      width={100}
    />
  ) : (
    <form className="login-form" autoComplete="off">
      <TextField
        InputProps={{
          style: {
            color: "white",
            marginLeft: "2rem",
            width: "90%",
          },
        }}
        className="text"
        id="chat-username"
        label="Enter Username"
        margin="normal"
        fullWidth
        rows="1"
        inputRef={userNameInput}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            signup();
          }
        }}
      />
      <TextField
        InputProps={{
          style: {
            color: "white",
            marginLeft: "2rem",
            width: "90%",
          },
        }}
        id="chat-username"
        label="Enter Password"
        margin="normal"
        fullWidth
        rows="1"
        inputRef={passwordInput}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            signup();
          }
        }}
      />
      <TextField
        InputProps={{
          style: {
            color: "white",
            marginLeft: "2rem",
            width: "90%",
          },
        }}
        id="chat-username"
        label="Enter Role"
        margin="normal"
        fullWidth
        rows="1"
        inputRef={roleInput}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            signup();
          }
        }}
      />
      {/* <label>
        <input
          style={{ display: "none" }}
          id="upload-avatar"
          name="upload-avatar"
          ref={imageInput}
          type="file"
          accept="image/x-png,image/gif,image/jpeg"
        />
        <Fab
          color="secondary"
          size="small"
          component="span"
          aria-label="add"
          variant="extended"
        >
          <AddIcon /> Upload avatar
        </Fab>
        <br />
        <br />
      </label> */}
      <Button
        style={{ marginTop: "10px", marginLeft: "2rem" }}
        variant="contained"
        color="primary"
        onClick={signup}
      >
        Register
      </Button>

      <TextField
        InputProps={{
          style: {
            color: "white",
            marginLeft: "2rem",
            width: "90%",
          },
        }}
        id="chat-username"
        label="Enter Username"
        margin="normal"
        fullWidth
        rows="1"
        inputRef={userNameLoginInput}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            enterChatClick();
          }
        }}
      />
      <TextField
        InputProps={{
          style: {
            color: "white",
            marginLeft: "2rem",
            width: "90%",
          },
        }}
        id="chat-username"
        label="Enter Password"
        margin="normal"
        fullWidth
        rows="1"
        inputRef={passwordLoginInput}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            enterChatClick();
          }
        }}
      />
      <Button
        style={{ marginTop: "10px", marginLeft: "2rem" }}
        variant="contained"
        color="primary"
        onClick={enterChatClick}
      >
        Signin
      </Button>
    </form>
  );
};

export default LoginForm;
