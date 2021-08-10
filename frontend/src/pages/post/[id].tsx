import { withUrqlClient } from "next-urql";
import React from "react";
import { CreateUrqlClient } from "../../utills/createUrqlClient";
import { Layout } from "../../components/Layout";
import { Heading, Box } from "@chakra-ui/react";
import { useGetPost } from "../../utills/useGetPost";

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPost();

  if (fetching) {
    return (
      <Layout>
        <Box>loading...</Box>
      </Layout>
    );
  }

  if (error) {
    return <Box>{error.message}</Box>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Post not find</Box>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <Heading mb={4}>{data?.post?.title}</Heading>
        <Box>{data?.post?.text}</Box>
      </Layout>
    </>
  );
};

export default withUrqlClient(CreateUrqlClient, { ssr: true })(Post);
