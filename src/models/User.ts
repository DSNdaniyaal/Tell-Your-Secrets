
import mongoose, { Document, Model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate = require("mongoose-findorcreate");


export interface IUser extends Document {
  username: string;
  password: string;
  googleId?: string;
  secret?: string;
}

interface IUserModel extends Model<IUser> {
  register: any;
  createStrategy: any;
  findOrCreate: any;
}

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
