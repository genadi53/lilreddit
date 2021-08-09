import { withUrqlClient } from "next-urql";
import { CreateUrqlClient } from "../utills/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { Upvote } from "../components/Upvote";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return (
      <>
        <div>No posts to show</div>
        <div>{JSON.stringify(!fetching)}</div>
        <div>{JSON.stringify(data)}</div>
      </>
    );
  }

  return (
    <>
      <Layout>
        <Flex mb={8}>
          <Heading>LilReddit</Heading>
          <NextLink href="/create-post">
            <Link ml="auto">Create Post</Link>
          </NextLink>
        </Flex>

        {fetching && !data ? (
          <Box>loading...</Box>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((p) => {
              return (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <Upvote post={p}></Upvote>
                  <Box>
                    <Heading fontSize="xl">{p.title}</Heading>
                    <Text>posted by {p.creator.username}</Text>
                    <Text mt={4}>{p.textSnippet}</Text>
                  </Box>
                </Flex>
              );
            })}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex my={8}>
            <Button
              m="auto"
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
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

export default withUrqlClient(CreateUrqlClient, { ssr: true })(Index);
