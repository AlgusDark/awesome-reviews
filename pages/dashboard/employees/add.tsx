import { Flex, FormControl, FormLabel, Input, Button } from "@chakra-ui/core";
import { useRouter } from "next/router";

import { useAPI } from "utils/use-api";

export default function Add() {
  const { post, response, loading } = useAPI();
  const router = useRouter();

  async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //@ts-ignore TODO: Use proper way for handling forms
    const { firstName, lastName, email } = e.currentTarget.elements;

    if ((firstName.value, lastName.value, email.value)) {
      const user = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      };

      const newEmployee = await post("/employees", user);

      if (response.ok) {
        router.push("/dashboard/employees");
      }
    }
  }

  return (
    <form
      style={{
        margin: "0 auto",
        maxWidth: "720px",
      }}
      onSubmit={handleOnSubmit}
    >
      <Flex direction="column">
        <FormControl id="firstName">
          <FormLabel>First Name</FormLabel>
          <Input name="firstName" type="text" />
        </FormControl>
        <FormControl id="lastName">
          <FormLabel>Last Name</FormLabel>
          <Input name="lastName" type="text" />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input name="email" type="email" />
        </FormControl>
      </Flex>
      <Flex mt={4} direction="row">
        <Button
          colorScheme="green"
          mr={3}
          onClick={() => router.push("/dashboard/employees")}
        >
          Cancel
        </Button>
        <Button isLoading={loading} type="submit" colorScheme="blue">
          Save
        </Button>
      </Flex>
    </form>
  );
}
