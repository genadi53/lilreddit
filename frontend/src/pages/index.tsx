import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { EditDeleteButtons } from "../components/EditDeleteButtons";
import { Layout } from "../components/Layout";
import { Upvote } from "../components/Upvote";
import { usePostsQuery } from "../generated/graphql";
import { CreateUrqlClient } from "../utills/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as null | string,
  });

  const [{ data, error, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) {
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
        {fetching && !data ? (
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
