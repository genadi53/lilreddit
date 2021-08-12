import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import {
  useCurrentUserQuery,
  useDeletePostMutation,
} from "../generated/graphql";

interface EditDeleteButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [deletePost] = useDeletePostMutation();
  const { data: currentUserData } = useCurrentUserQuery();

  if (currentUserData?.getCurrentUser?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
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
          deletePost({
            variables: { id },
            update: (cache) => {
              cache.evict({ id: "Post: " + id });
            },
          });
        }}
        icon={<DeleteIcon></DeleteIcon>}
      ></IconButton>
    </Box>
  );
};
