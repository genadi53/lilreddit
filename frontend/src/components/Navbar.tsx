import React from "react";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useCurrentUserQuery } from "../generated/graphql";

interface navbarProps {}

export const Navbar: React.FC<navbarProps> = ({}) => {
  const [{ data, fetching }] = useCurrentUserQuery();
  let body = null;

  if (fetching) {
  } else if (!data?.getCurrentUser) {
    body = (
      <>
        <Box ml={"auto"}>
          <NextLink href="/login">
            <Link color="white" mr={2}>
              Login
            </Link>
          </NextLink>
          <NextLink href="/register">
            <Link color="white" mr={2}>
              Register
            </Link>
          </NextLink>
        </Box>
      </>
    );
  } else {
    console.log(data.getCurrentUser.username);
    body = (
      <Flex ml={"auto"}>
        <Box mr={2}>{data.getCurrentUser.username}</Box>
        <Button variant="link">Logout</Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tan" p={4}>
      {body}
    </Flex>
  );
};
