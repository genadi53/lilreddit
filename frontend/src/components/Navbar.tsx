import React from "react";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useCurrentUserQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utills/isServer";

interface navbarProps {}

export const Navbar: React.FC<navbarProps> = ({}) => {
  const [{ data, fetching }] = useCurrentUserQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  if (isServer() || fetching) {
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
    // console.log(data.getCurrentUser.username);
    body = (
      <Flex ml={"auto"} align={"center"}>
        <Flex>
          <NextLink href="/create-post">
            <Button as={Link} mr={4}>
              Create Post
            </Button>
          </NextLink>
        </Flex>
        <Box mr={2}>{data.getCurrentUser.username}</Box>
        <Button
          variant="link"
          onClick={() => logout()}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex position="sticky" top={0} zIndex={1} bg="tan" p={4} align="center">
      <Flex flex={1} align={"center"} m={"auto"} maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>LilReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
