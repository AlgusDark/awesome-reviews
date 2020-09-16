import { Flex, FormControl, FormLabel, Input, Button } from "@chakra-ui/core";
import { useRouter } from "next/router";

import { useAPI } from "utils/use-api";
import { useEffect, useState } from "react";
import { Loading } from "components/loading";

export default function Edit() {
  const { get, put, response, loading } = useAPI();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      const initialEmployeesList = await get(`/employees/${router.query.id}`);

      if (response.ok) setEmployee(initialEmployeesList);
    };

    getEmployees();
  }, []);

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

      await put(`/employees/${router.query.id}`, user);

      if (response.ok) {
        router.push("/dashboard/employees");
      }
    }
  }

  return (
    <>
      {!employee && <Loading />}
      {employee && (
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
              <Input
                defaultValue={employee.firstName}
                name="firstName"
                type="text"
              />
            </FormControl>
            <FormControl id="lastName">
              <FormLabel>Last Name</FormLabel>
              <Input
                defaultValue={employee.lastName}
                name="lastName"
                type="text"
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input defaultValue={employee.email} name="email" type="email" />
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
      )}
    </>
  );
}
