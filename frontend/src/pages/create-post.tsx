import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { CreateUrqlClient } from "../utills/createUrqlClient";
import { useIsAuth } from "../utills/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();
  useIsAuth();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="Title" placeholder="title" />
            <Box mt={4}>
              <InputField
                name="text"
                label="Body"
                placeholder="text..."
                textarea
              />
            </Box>

            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              color="white"
              backgroundColor="teal"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(CreateUrqlClient)(CreatePost);
