import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { EditDeleteButtons } from "../components/EditDeleteButtons";
import { Layout } from "../components/Layout";
import { Upvote } from "../components/Upvote";
// import { PostsQuery } from "../generated/graphql";
import { usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utills/withApollo";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 5,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <>
        <div>No posts to show</div>
        <div>{error?.message}</div>
      </>
    );
  }

  return (
    <>
      <Layout>
        {loading && !data ? (
          <Box>loading...</Box>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <Upvote post={p}></Upvote>
                  <Box flex={1}>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading fontSize="xl">{p.title}</Heading>
                      </Link>
                    </NextLink>

                    <Text>posted by {p.creator.username}</Text>
                    <Flex align={"center"}>
                      <Text flex={1} mt={4}>
                        {p.textSnippet}
                      </Text>
                      <EditDeleteButtons id={p.id} creatorId={p.creator.id} />
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex my={8}>
            <Button
              m="auto"
              onClick={() => {
                fetchMore({
                  variables: {
                    limit: variables!.limit,
                    cursor:
                      data.posts.posts[data.posts.posts.length - 1].createdAt,
                  },
                  // updateQuery: (
                  //   previousValue,
                  //   { fetchMoreResult }
                  // ): PostsQuery => {
                  //   if (!fetchMoreResult) {
                  //     return previousValue as PostsQuery;
                  //   }
                  //   return {
                  //     __typename: "Query",
                  //     posts: {
                  //       __typename: "PaginatedPosts",
                  //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                  //       posts: [
                  //         ...(previousValue as PostsQuery).posts.posts,
                  //         ...(fetchMoreResult as PostsQuery).posts.posts,
                  //       ],
                  //     },
                  //   };
                  // },
                });
              }}
            >
              Load More
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
