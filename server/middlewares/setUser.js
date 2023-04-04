import { userModel } from "../models/user";

export const setUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({
      error: "Forbidden",
    });
  }

  try {
    const payload = await verifyAccessToken(authorization);
    let user = await userModel.findOne({
      username: payload.username,
    });
    if (!user) {
      res.status(404).json({ error: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
