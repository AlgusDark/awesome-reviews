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
import { Loading } from "components/loading";

type UseCardProps = {
  reviewee: ArrayType<AwesomeReviews.Review["reviewers"]>;
};

function UserCard({ reviewee }: UseCardProps) {
  const router = useRouter();

  return (
    <VStack
      onClick={() => router.push("/me/[reviewId]", `/me/${reviewee.reviewId}`)}
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
      <Avatar name={`${reviewee.firstName} ${reviewee.lastName}`} />
      <Flex>
        <Text
          ml={2}
          textTransform="uppercase"
          fontSize="sm"
          fontWeight="bold"
          color="pink.800"
        >
          {reviewee.firstName} {reviewee.lastName}
        </Text>
      </Flex>
      <Flex align="baseline" mt={2}>
        {reviewee.active ? (
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

  const [reviewees, setReviews] = useState<AwesomeReviews.Review["reviewers"]>(
    []
  );

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
      {loading && <Loading />}
      {!loading && reviewees.length === 0 && <Empty />}
      {!loading && reviewees.length > 0 && (
        <HStack mt={8} spacing={8}>
          {reviewees.map((reviewee) => (
            <UserCard key={reviewee.reviewId} reviewee={reviewee} />
          ))}
        </HStack>
      )}
    </Box>
  );
}
