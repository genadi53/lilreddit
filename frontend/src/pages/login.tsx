import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utills/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { CreateUrqlClient } from "../utills/createUrqlClient";
import NextLink from "next/link";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation(); //useMutation(``)
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const responce = await login(values);
          if (responce.data?.login.errors) {
            setErrors(toErrorMap(responce.data.login.errors));
          } else if (responce.data?.login.user) {
            const nextLocation =
              typeof router.query.next === "string" ? router.query.next : "/";
            router.push(nextLocation);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="username or email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              color="white"
              backgroundColor="teal"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(CreateUrqlClient)(Login);
