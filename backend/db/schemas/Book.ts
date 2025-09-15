import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface BookDocument extends Document {
  title: string;
  published: number;
  author: mongoose.Types.ObjectId;
  genres: string[];
}

const schema = new mongoose.Schema<BookDocument>({
  title: {
    type: String,
    required: true,
    unique: true,
    minLength: 5
  },
  published: {
    type: Number
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    {
      type: String
    }
  ]
});

schema.plugin(uniqueValidator);

export default mongoose.model<BookDocument>('Book', schema);
