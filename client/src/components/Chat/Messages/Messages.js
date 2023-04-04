import React, { Fragment } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import "./Messages.css";

const Messages = ({ messages }) => {
  return (
    <List>
      <div className="msg">
        {messages.flatMap((messageObject, index) => [
          <ListItem alignItems="flex-start" key={index}>
            <ListItemAvatar>
              <Avatar
                alt="Avatar alt text"
                src={messageObject.user_avatar}
              />
            </ListItemAvatar>
            <ListItemText
              primary={messageObject.user_name}
              primaryTypographyProps={{
                style: {
                  color: "blue",
                  marginLeft: "2rem",
                },
              }}
              secondary={
                <Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {messageObject.message_text}
                  </Typography>
                </Fragment>
              }
              secondaryTypographyProps={{
                style: { marginLeft: "2rem" },
              }}
            />
          </ListItem>,
          <Divider
            variant="inset"
            component="li"
            key={"divider-" + index}
          />,
        ])}
      </div>
    </List>
  );
};

export default Messages;
