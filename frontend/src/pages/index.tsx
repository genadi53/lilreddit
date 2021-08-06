import { withUrqlClient } from "next-urql";
import { CreateUrqlClient } from "../utills/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Box, Link } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <>
      <Layout>
        <NextLink href="/create-post">
          <Link>Create Post</Link>
        </NextLink>

        {!data ? (
          <Box>loading...</Box>
        ) : (
          data.posts.map((p) => <Box key={p.id}>{p.title}</Box>)
        )}
      </Layout>
    </>
  );
};
export default withUrqlClient(CreateUrqlClient, { ssr: true })(Index);
