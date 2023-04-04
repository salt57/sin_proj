import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  rolename: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Role", roleSchema);
