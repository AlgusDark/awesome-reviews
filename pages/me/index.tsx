import { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Flex,
  Badge,
  Text,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/core";
import { useRouter } from "next/router";

import { useUser } from "utils/use-user";
import { useAPI } from "utils/use-api";
import { Loader } from "components/loader";

function UserCard({ review }) {
  const router = useRouter();

  return (
    <VStack
      onClick={() => router.push("/me/[reviewId]", `/me/${review.reviewId}`)}
      _hover={{
        cursor: "pointer",
        transform: "translateY(-5px) scale(1.005) translateZ(0)",
        boxShadow:
          "0 24px 36px rgba(0,0,0,0.11), 0 24px 46px var(--box-shadow-color)",
      }}
      style={{
        transition: "all 0.3s ease-out",
      }}
      spacing={4}
      textAlign="center"
      borderRadius="10px"
      borderWidth="1px"
      padding={4}
    >
      <Avatar name={`${review.firstName} ${review.lastName}`} />
      <Flex>
        <Text
          ml={2}
          textTransform="uppercase"
          fontSize="sm"
          fontWeight="bold"
          color="pink.800"
        >
          {review.firstName} {review.lastName}
        </Text>
      </Flex>
      <Flex align="baseline" mt={2}>
        {review.active ? (
          <Badge variant="outline">Not Finished</Badge>
        ) : (
          <Badge variant="solid">Finished</Badge>
        )}
      </Flex>
    </VStack>
  );
}

function Empty() {
  return (
    <Flex justifyContent="center">
      <Heading>You don't have reviews.</Heading>
    </Flex>
  );
}

export default function Me() {
  const [user] = useUser();
  const { post, response, loading } = useAPI();

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getReviews() {
      const myReviews = await post("/me", { id: user.id });

      if (response.ok) {
        setReviews(myReviews);
      }
    }

    getReviews();
  }, []);

  return (
    <Box>
      <Heading>My Reviews</Heading>
      {loading && (
        <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
          <Loader />
        </Flex>
      )}
      {!loading && reviews.length === 0 && <Empty />}
      {!loading && reviews.length > 0 && (
        <HStack mt={8} spacing={8}>
          {reviews.map((review) => (
            <UserCard key={review.reviewId} review={review} />
          ))}
        </HStack>
      )}
    </Box>
  );
}
