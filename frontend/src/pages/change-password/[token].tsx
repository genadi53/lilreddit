import React from "react";
// import { NextPage } from "next";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utills/toErrorMap";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  NextComponentType,
  PartialNextContext,
  withUrqlClient,
} from "next-urql";
import { CreateUrqlClient } from "../../utills/createUrqlClient";
import NextLink from "next/link";

const ChangePassword: NextComponentType<
  PartialNextContext,
  { token: string },
  {}
> =
  //NextPage<{ token: string }> =
  () => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");

    return (
      <Wrapper variant="small">
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const responce = await changePassword({
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            });
            if (responce.data?.changePassword.errors) {
              const errorMap = toErrorMap(responce.data?.changePassword.errors);
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (responce.data?.changePassword.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                label="New password"
                type="password"
                placeholder="new password"
              />
              {tokenError ? (
                <Flex>
                  <Box color="red" mr={2}>
                    {tokenError}
                  </Box>
                  <NextLink href="/forgot-password">
                    <Link>get new link from here</Link>
                  </NextLink>
                </Flex>
              ) : null}

              <Button
                mt={4}
                isLoading={isSubmitting}
                type="submit"
                color="white"
                backgroundColor="teal"
              >
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
  };

export default withUrqlClient(CreateUrqlClient)(ChangePassword);
