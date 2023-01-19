import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    statusUser: {
      type: String,
      default: 'available',
    },
    loginTime: {
      type: Date,
      default: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
