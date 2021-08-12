import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";
import gql from "graphql-tag";
import { ApolloCache } from "@apollo/client";

interface UpvoteProps {
  post: PostSnippetFragment; //PostsQuery["posts"]['posts'][0];
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<any>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });
  if (data) {
    if (data.voteStatus === value) return;
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment _ on Post {
          id
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

export const Upvote: React.FC<UpvoteProps> = ({ post }) => {
  const [loadingState, setLoading] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
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
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => {
              updateAfterVote(1, post.id, cache);
            },
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
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => {
              updateAfterVote(-1, post.id, cache);
            },
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
