import {
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  Button,
  Stack,
} from "@chakra-ui/core";
import { Loading } from "components/loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAPI } from "utils/use-api";

function Question({ question }) {
  return (
    <FormControl id={question.id}>
      <FormLabel>
        <Text fontSize="xl">{question.title}</Text>
      </FormLabel>
      <Textarea name={question.id} placeholder="Write your answer" />
    </FormControl>
  );
}

function Answer({ answer }) {
  return (
    <Stack direction="column" mb={8}>
      <Text fontSize="xl">{answer.question}</Text>
      <Text>{answer.answer}</Text>
    </Stack>
  );
}

export default function Review() {
  const router = useRouter();
  const { get, post, response, loading } = useAPI();

  const [questions, setQuestions] = useState([]);
  const [reviewee, setReviewee] = useState(null);

  useEffect(() => {
    async function getQuestions() {
      const initReviewee = await get(`/me/reviews/${router.query.reviewId}`);

      if (initReviewee) {
        setReviewee(initReviewee);
      }

      if (initReviewee?.active) {
        const initQuestions = await get("/reviews/questions");
        setQuestions(initQuestions);
      }
    }

    getQuestions();
  }, []);

  async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let answers = [];

    for (let index = 0; index < e.currentTarget.elements.length; index++) {
      const element = e.currentTarget.elements[index];

      if (element.nodeName === "TEXTAREA") {
        const answer = (element as HTMLTextAreaElement).value.trim();

        if (answer) {
          answers.push({
            id: element.id,
            answer: (element as HTMLTextAreaElement).value,
          });
        }
      }
    }

    if (answers.length === questions.length) {
      await post(`/me/reviews/${router.query.reviewId}`, { answers });

      if (response.ok) {
        router.push("/me");
      }
    }
  }

  return (
    <>
      {loading && questions.length === 0 && <Loading />}
      {reviewee && reviewee.active === 0 && (
        <>
          <Heading>
            Review: {reviewee.firstName} {reviewee.lastName}
          </Heading>
          <Flex direction="column" pt={8}>
            {reviewee.answers.map((answer) => (
              <Answer key={answer.id} answer={answer} />
            ))}
            <Flex direction="row">
              <Button onClick={() => router.back()} colorScheme="blue">
                Return
              </Button>
            </Flex>
          </Flex>
        </>
      )}
      {questions.length > 0 && reviewee && (
        <>
          <Heading>
            Review: {reviewee.firstName} {reviewee.lastName}
          </Heading>
          <Flex pt={8}>
            <form onSubmit={handleOnSubmit}>
              {questions.map((question) => (
                <Question key={question.id} question={question} />
              ))}
              <Flex mt={4} direction="row">
                {reviewee.active ? (
                  <>
                    <Button
                      colorScheme="green"
                      mr={3}
                      onClick={() => router.push("/me")}
                    >
                      Cancel
                    </Button>
                    <Button
                      isLoading={loading}
                      type="submit"
                      colorScheme="blue"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => router.back()} colorScheme="blue">
                    Return
                  </Button>
                )}
              </Flex>
            </form>
          </Flex>
        </>
      )}
    </>
  );
}
