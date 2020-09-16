import {
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  Button,
} from "@chakra-ui/core";
import { Loader } from "components/loader";
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

export default function Review() {
  const router = useRouter();
  const { get, post, response, loading } = useAPI();

  const [questions, setQuestions] = useState([]);
  const [reviewee, setReviewee] = useState(null);

  useEffect(() => {
    async function getQuestions() {
      const initQuestions = await get("/reviews/questions");
      const initReviewee = await get(`/me/reviews/${router.query.reviewId}`);

      if (response.ok) {
        setQuestions(initQuestions);
        setReviewee(initReviewee);
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
      {loading && questions.length === 0 && (
        <Flex alignItems="center" justifyContent="center">
          <Loader />
        </Flex>
      )}
      {questions.length > 0 && reviewee && (
        <Heading>
          Review: {reviewee.firstName} {reviewee.lastName}
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
        </Heading>
      )}
    </>
  );
}
