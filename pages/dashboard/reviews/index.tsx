import { useEffect, useState, useRef } from "react";
import { Loading } from "components/loading";
import {
  Flex,
  IconButton,
  Button,
  Heading,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  HStack,
  Badge,
} from "@chakra-ui/core";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

import { useAPI } from "utils/use-api";
import Link from "next/link";

export default function Reviews() {
  const { get, delete: remove, response, loading } = useAPI();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [reviews, setReviews] = useState<AwesomeReviews.Review[]>([]);
  const selectedReview = useRef<AwesomeReviews.Review>(null);

  useEffect(() => {
    const getReviews = async () => {
      const initialReviews = await get("/reviews");

      if (response.ok) setReviews(initialReviews);
    };

    getReviews();
  }, []);

  function DeleteReviewAlert() {
    const cancelRef = useRef();
    const reviewToDelete = selectedReview.current;

    return (
      reviewToDelete && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete {reviewToDelete.firstName} {reviewToDelete.lastName}{" "}
                Reviews
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    await remove(`/reviews/${reviewToDelete.employeeId}`);

                    if (response.ok) {
                      setReviews((reviews) =>
                        reviews.filter(
                          (review) =>
                            review.employeeId !== reviewToDelete.employeeId
                        )
                      );
                      onClose();
                    }
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )
    );
  }

  return (
    <div>
      {loading && reviews.length < 0 && <Loading />}
      {reviews.length > 0 && (
        <>
          <Flex justifyContent="space-between">
            <Heading>Reviews</Heading>
            <Button
              onClick={() => router.push("/dashboard/reviews/add")}
              colorScheme="blue"
            >
              <AddIcon mr={2} /> Add Review
            </Button>
          </Flex>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th style={{ width: "30%" }}>Reviewers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.employeeId}>
                  <td>{review.employeeId}</td>
                  <td>
                    {review.firstName} {review.lastName}
                  </td>
                  <td>
                    <HStack>
                      {review.reviewers.map((reviewer) =>
                        reviewer.active ? (
                          <Badge
                            key={reviewer.reviewId}
                            variant="outline"
                            colorScheme="green"
                          >
                            {reviewer.firstName} {reviewer.lastName}
                          </Badge>
                        ) : (
                          <Link
                            key={reviewer.reviewId}
                            href="/me/[reviewId]"
                            as={`/me/${reviewer.reviewId}`}
                          >
                            <Badge
                              _hover={{ cursor: "pointer" }}
                              variant="solid"
                              colorScheme="green"
                            >
                              {reviewer.firstName} {reviewer.lastName}
                            </Badge>
                          </Link>
                        )
                      )}
                    </HStack>
                  </td>
                  <td>
                    <Flex justifyContent="center">
                      <Link
                        href={`/dashboard/reviews/[id]`}
                        as={`/dashboard/reviews/${review.employeeId}`}
                      >
                        <IconButton
                          colorScheme="blue"
                          aria-label="Edit Review"
                          size="lg"
                          icon={<EditIcon />}
                        />
                      </Link>
                      <IconButton
                        onClick={() => {
                          selectedReview.current = review;
                          onOpen();
                        }}
                        ml={8}
                        colorScheme="red"
                        aria-label="Delete Review"
                        size="lg"
                        icon={<DeleteIcon />}
                      />
                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
            <style jsx>{`
              table {
                border-collapse: collapse;
                background: white;
                width: 100%;
              }

              table * {
                text-align: center;
              }

              table thead tr {
                height: 60px;
                background: #36304a;
                font-size: 18px;
                color: #fff;
              }

              table tbody tr {
                height: 50px;
              }

              tbody tr {
                font-size: 15px;
                color: #808080;
              }
            `}</style>
          </table>
          <DeleteReviewAlert />
        </>
      )}
    </div>
  );
}
