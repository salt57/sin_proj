import User from "../models/user";

export default async (username, pass) => {
  const user = await User.findOne({ username });
  if (!user) {
    return false;
  }
  if (pass !== user.password) {
    return false;
  }
  return true;
};
