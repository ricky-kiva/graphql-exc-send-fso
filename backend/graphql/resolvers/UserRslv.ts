import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../../db/schemas/User';
import { throwBadUserInput } from '../exception/exception';
import { CreateUserArgs, LoginArgs } from './args-types/userRslvArgs';
import { Token } from '../../types/Token';
import { Types } from 'mongoose';
import { Context } from '../types/Context';

const USER_HARDCODED_PASSWORD = 'secret';

const userQueryRslv = {
  me: (_: unknown, __: unknown, context: Context) => {
    return context.currentUser;
  }
};

const userMutationRslv = {
  createUser: async (_: unknown, args: CreateUserArgs): Promise<UserDocument> => {
    const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });

    return user
      .save()
      .catch((e: unknown) => {
        const baseMessage = "Creating the user failed";
        const errorMessages = (e instanceof Error)
          ? `${baseMessage}: ${e.message}`
          : baseMessage;

        throwBadUserInput(errorMessages);
      });
  },
  login: async (_: unknown, args: LoginArgs): Promise<Token> => {
    const user: (UserDocument | null) = await User.findOne({ username: args.username });

    if (!user || args.password !== USER_HARDCODED_PASSWORD) throwBadUserInput("Wrong credentials");

    const userForToken = {
      username: user.username,
      id: user._id as Types.ObjectId
    };

    return {value: jwt.sign(userForToken, process.env.JWT_SECRET as string) };
  }
};

export {
  userQueryRslv,
  userMutationRslv
};
