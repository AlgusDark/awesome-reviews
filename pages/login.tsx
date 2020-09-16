import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/core";
import useFetch from "use-http";
import { useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { useUser } from "utils/use-user";

function Error() {
  return (
    <Box mt={4}>
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Your credentials are wrong!</AlertTitle>
        <AlertDescription>Please verify your credentials.</AlertDescription>
      </Alert>
    </Box>
  );
}

export default function Signup() {
  const email = useRef(null);
  const password = useRef(null);

  const router = useRouter();
  const [, setUser] = useUser();

  useEffect(() => {
    if (router.asPath === "/logout") {
      setUser({ isLoggedIn: false });
    }
  }, [router]);

  const { post, response, error, loading } = useFetch("/api");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.current.value && password.current.value) {
      const data = await post("/login", {
        email: email.current.value,
        password: password.current.value,
      });

      if (response.ok) {
        setUser({ ...data, isLoggedIn: true });
        router.push("/");
      }
    }
  }

  return (
    <Box maxW="560px" margin="0 auto">
      <form onSubmit={onSubmit}>
        <Flex direction="column">
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input ref={email} type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input ref={password} type="password" />
          </FormControl>
          {error && <Error />}
          <Button isLoading={loading} mt={4} colorScheme="teal" type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
