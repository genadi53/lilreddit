import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
// import { EntityManager } from "@mikro-orm/postgresql";
import { FieldError, UsernamePasswordInput } from "./UsernamePasswordInput";
import { registerErrors, validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/emailSender";
import { v4 as uuidv4 } from "uuid";
import { FORGET_PASSWORD_PREFIX } from "../constants";

@ObjectType()
class userResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx()
    { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (!user) {
      return true;
    }

    const token = uuidv4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    );
    const mailBody = `<a href=http://localhost:3000/change-password/${token}>Reset Password</a>`;
    await sendEmail(user.email, "Forgot Password", mailBody);
    return true;
  }

  @Mutation(() => userResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { em, req, redis }: MyContext
  ): Promise<userResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "lenght must be greather than 2",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const user = await em.findOne(User, { id: parseInt(userId) });
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);
    em.persistAndFlush(user);
    await redis.del(key);

    // log in after change pass
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => userResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<userResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hasedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      email: options.email,
      password: hasedPassword,
    });
    // let user;
    try {
      // const result = await (em as EntityManager)
      //   .createQueryBuilder(User)
      //   .getKnexQuery()
      //   .insert({
      //     username: options.username,
      //     password: hasedPassword,
      //     created_at: new Date(),
      //     updated_at: new Date(),
      //   })
      //   .returning("*");
      // user = result[0];
      await em.persistAndFlush(user);
    } catch (err) {
      const responce = registerErrors(err);
      if (responce) {
        return responce;
      }
    }
    // log in after register
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => userResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<userResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username does not exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;
    return { user };
  }

  @Query(() => User, { nullable: true })
  async getCurrentUser(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
