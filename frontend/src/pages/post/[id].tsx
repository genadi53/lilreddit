import React from "react";
import { Layout } from "../../components/Layout";
import { Heading, Box } from "@chakra-ui/react";
import { useGetPost } from "../../utills/useGetPost";
import { EditDeleteButtons } from "../../components/EditDeleteButtons";
import { withApollo } from "../../utills/withApollo";

const Post = ({}) => {
  const { data, error, loading } = useGetPost();

  if (loading) {
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
        <Box mb={4}>{data?.post?.text}</Box>
        <EditDeleteButtons
          id={data?.post?.id}
          creatorId={data.post.creator.id}
        />
      </Layout>
    </>
  );
};

export default withApollo({ ssr: true })(Post);
