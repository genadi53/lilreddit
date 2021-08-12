import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteProps {
  post: PostSnippetFragment; //PostsQuery["posts"]['posts'][0];
}

export const Upvote: React.FC<UpvoteProps> = ({ post }) => {
  const [loadingState, setLoading] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [, /*{ fetching, operation },*/ vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        aria-label="upvote post"
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoading("upvote-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoading("not-loading");
        }}
        // isLoading={fetching && operation?.variables?.value === 1}
        isLoading={loadingState === "upvote-loading"}
        backgroundColor={post.voteStatus === 1 ? "green" : undefined}
        icon={<ChevronUpIcon w={6} h={6} />}
      ></IconButton>

      {post.points}
      <IconButton
        aria-label="downvote post"
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoading("downvote-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoading("not-loading");
        }}
        // isLoading={fetching && operation?.variables?.value === -1}
        isLoading={loadingState === "downvote-loading"}
        backgroundColor={post.voteStatus === -1 ? "red" : undefined}
        icon={<ChevronDownIcon w={6} h={6} />}
      ></IconButton>
    </Flex>
  );
};
