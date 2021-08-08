import { Resolver, Mutation, Arg, Ctx, Int, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { Upvote } from "../entities/Upvote";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";

@Resolver()
export class UpvoteResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    const isUpvote = value !== -1;
    const realValue = isUpvote ? 1 : -1;
    await Upvote.insert({
      userId,
      postId,
      value: realValue,
    });

    // const post = await Post.findOne(postId);
    // await Post.update(postId, { points: post!.points + realValue });

    await getConnection().query(
      `
      start transaction;

      insert into upvote ("userId", "postId", value)
      values (${userId},${postId},${realValue});
      update post
      set points = points + ${realValue}
      where id = ${postId};
      commit;
      `
    );
    return true;
  }
}
