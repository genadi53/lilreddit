import { withUrqlClient } from "next-urql";
import { CreateUrqlClient } from "../utills/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
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
import React, { useState } from "react";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return <div>No posts to show</div>;
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
            {data!.posts.map((p) => (
              <Box key={p.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            ))}
          </Stack>
        )}
        {data ? (
          <Flex my={8}>
            <Button
              m="auto"
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor: data.posts[data.posts.length - 1].createdAt,
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
