import DataLoader from "dataloader";
import { Upvote } from "../entities/Upvote";

export const createUpvoteLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Upvote | null>(
    async (keys) => {
      const upvotes = await Upvote.findByIds(keys as any);

      const upvotesMap: Record<string, Upvote> = {};
      upvotes.forEach((upvote) => {
        upvotesMap[`${upvote.userId}-${upvote.postId}`] = upvote;
      });

      const result = keys.map(
        (key) => upvotesMap[`${key.userId}-${key.postId}`]
      );
      // console.log(result);
      return result;
    }
  );
