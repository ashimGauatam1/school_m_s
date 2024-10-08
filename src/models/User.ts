import mongoose, { Schema } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVeified: boolean;
  Code: string;
  role: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "Email must be unique"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isVeified: {
    type: Boolean,
    default: false,
  },
  Code: {
    type: String,
    required: [true, "code is required"],
  },
  role:{
    type:String,
    default:"user",
    required:[true,"role is required"]

  }
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
