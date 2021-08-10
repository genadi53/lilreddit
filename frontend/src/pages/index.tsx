import { withUrqlClient } from "next-urql";
import { CreateUrqlClient } from "../utills/createUrqlClient";
import {
  useCurrentUserQuery,
  useDeletePostMutation,
  usePostsQuery,
} from "../generated/graphql";
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
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as null | string,
  });

  const [{ data: currentUserData }] = useCurrentUserQuery();
  const [{ data, fetching }] = usePostsQuery({ variables });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return (
      <>
        <div>No posts to show</div>
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

                      {currentUserData?.getCurrentUser?.id !==
                      p.creator.id ? null : (
                        <Box>
                          <NextLink
                            href="/post/edit/[id]"
                            as={`/post/edit/${p.id}`}
                          >
                            <IconButton
                              as={Link}
                              aria-label="edit-post"
                              mr={4}
                              icon={<EditIcon></EditIcon>}
                            ></IconButton>
                          </NextLink>

                          <IconButton
                            aria-label="delete-post"
                            // backgroundColor="red"
                            onClick={() => {
                              deletePost({ id: p.id });
                            }}
                            icon={<DeleteIcon></DeleteIcon>}
                          ></IconButton>
                        </Box>
                      )}
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
