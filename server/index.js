import socketIO from "socket.io";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import cryptr from "cryptr";
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();

import mongoConnect from "./config/mongo";
import Message from "./models/message";
import User from "./models/user";
import fileUploader from "./controllers/fileUploader";
import auth from "./helpers/auth";
import Role from "./models/role";

const io = socketIO(process.env.SOCKET_PORT);
const app = express();

// const check = (data) => {
//   User.findOne({ username: data.user_name })
//     .then((user) => {
//       if (!user) {
//         User.create({
//           username: data.user_name,
//           password: data.password,
//         })
//           .save()
//           .then(() => console.log("user created"));
//       } else if (user.password !== data.password) {
//         return false;
//       }
//       return true;
//     })
//     .catch((error) => {
//       return false;
//     });
// };

io.on("connection", (socket) => {
  console.log("Connection established");

  // socket.on("mostRecentMessages", (data) => {
  // if (!check(data)) {
  //   return;
  // }
  getMostRecentMessages()
    .then((results) => {
      socket.emit(
        "mostRecentMessages",
        results.reverse()
        // .filter(
        //   (msg) => msg.intent_role === data.currole
        // )
      );
    })
    .catch((error) => {
      socket.emit("mostRecentMessages", []);
    });
  // });

  socket.on("newChatMessage", (data) => {
    try {
      Role.findOne({ rolename: data.intent_role })
        .then((role) => {
          const encrypt = new cryptr(role.key);
          const message = new Message({
            user_name: data.user_name,
            user_avatar: data.user_avatar,
            message_text: encrypt.encrypt(data.message),
            intent_role: data.intent_role,
          });
          message
            .save()
            .then(() => {
              io.emit("newChatMessage", {
                user_name: data.user_name,
                user_avatar: data.user_avatar,
                intent_role: data.intent_role,
                message_text: encrypt.encrypt(data.message),
              });
            })
            .catch((error) =>
              console.log("error: " + error)
            );
        })
        .catch((e) => {
          console.log(e);
          return;
        });
      //   console.log(new cryptr('2635fecc42159d7d1e0316bdb05d4cf1aeba33ed'))
      // const message = new Message({
      //   user_name: data.user_name,
      //   user_avatar: data.user_avatar,
      //   message_text: encrypt.encrypt(data.message),
      //   intent_role: data.intent_role,
      // });
      // message
      //   .save()
      //   .then(() => {
      //     io.emit("newChatMessage", {
      //       user_name: data.user_name,
      //       user_avatar: data.user_avatar,
      //       intent_role: data.intent_role,
      //       message_text: encrypt.encrypt(data.message),
      //     });
      //   })
      //   .catch((error) => console.log("error: " + error));
    } catch (e) {
      console.log("error: " + e);
    }
  });
  socket.on("disconnect", () => {
    console.log("connection disconnected");
  });
});

/**
 * @returns {Promise<Model[]>}
 */
async function getMostRecentMessages() {
  return await Message.find().sort({ _id: -1 }).limit(10);
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.removeHeader("x-powered-by");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
  next();
});

app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post(
  "/api/upload",
  upload.single("avatar"),
  fileUploader
);
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user || user.password !== req.body.password) {
    return res.json({
      success: false,
    });
  }
  return res.json({
    success: true,
    role: user.role,
  });
});
// app.get("/api/rolekey", async (req, res) => {
//   const role = await Role.findOne({
//     rolename: req.body.rolename,
//   });
//   if (!role) {
//     return res.json({
//       success: false,
//     });
//   }
//   return res.json({
//     success: true,
//     key: role.publickey,
//   });
// });
app.post("/api/register", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (user) {
    return res.json({ success: false });
  }
  const role = await Role.findOne({
    rolename: req.body.role,
  });
  if (!role) {
    await new Role({
      rolename: req.body.role,
      key: crypto.randomBytes(20).toString("hex"),
    }).save();
  }
  await new User({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  }).save();
  return res.json({
    success: true,
  });
});

app.post("/api/decode", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user || user.role !== req.body.role) {
    return res.json({ success: false });
  }
  const role = await Role.findOne({ rolename: user.role });
  if (!role) {
    return res.json({ success: false });
  }

  const decrypt = new cryptr(role.key);
  for(let i = 0; i< req.body.messages.length; i++){
    req.body.messages[i].message_text = decrypt.decrypt(req.body.messages[i].message_text)
  }
  return res.json({
    success: true,
    messages: req.body.messages
  });
});

/**
 *
 * @returns {Promise<void>}
 */
const initApp = async () => {
  try {
    await mongoConnect();
    console.log("DB connection established");
    app.listen(process.env.HTTP_PORT, () =>
      console.log(
        `HTTP Server listening on ${process.env.HTTP_PORT}`
      )
    );
  } catch (e) {
    throw e;
  }
};

initApp().catch((err) =>
  console.log(`Error on startup! ${err}`)
);
