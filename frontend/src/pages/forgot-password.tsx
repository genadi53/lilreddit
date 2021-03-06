import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { CreateUrqlClient } from "../utills/createUrqlClient";

const ForgotPassword: React.FC = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          !complete ? (
            <Form>
              <InputField
                name="email"
                label="Email"
                placeholder="email"
                type="email"
              />

              <Button
                mt={4}
                isLoading={isSubmitting}
                type="submit"
                color="white"
                backgroundColor="teal"
              >
                Forgot Password
              </Button>
            </Form>
          ) : (
            <Box>If an account with that email exists, we sent you email</Box>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(CreateUrqlClient)(ForgotPassword);
