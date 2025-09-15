import mongoose, { Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  favoriteGenre: string;
}

const schema = new mongoose.Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  favoriteGenre: {
    type: String,
    required: true,
  }
});

export default mongoose.model<UserDocument>('User', schema);
