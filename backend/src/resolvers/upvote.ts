import { Upvote } from "../entities/Upvote";
import {
  Query,
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Int,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class HelloResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  vote(@Arg("postId", () => Int) postId: number, @Ctx() { req }: MyContext) {
    const { userId } = req.session;
    return true;
  }
}
