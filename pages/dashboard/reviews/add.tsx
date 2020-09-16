import {
  Flex,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  CheckboxGroup,
  Button,
} from "@chakra-ui/core";
import { useState } from "react";
import { useRouter } from "next/router";

import { useAPI } from "utils/use-api";
import { useEffect } from "react";
import { Loading } from "components/loading";

export default function Add() {
  const { get, post, response, loading } = useAPI();
  const router = useRouter();

  const [reviewersValues, setReviewersValues] = useState([]);

  const [employees, setEmployees] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    async function loadEmployees() {
      const initialEmployees = await get("/employees");
      if (response.ok) setEmployees(initialEmployees);
    }

    loadEmployees();
  }, []);

  async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (reviewersValues.length > 0 && selectedEmployee) {
      const data = {
        revieweeId: selectedEmployee,
        reviewers: reviewersValues,
      };

      await post("/reviews", data);

      if (response.ok) {
        router.push("/dashboard/reviews");
      }
    }
  }

  return (
    <>
      {!employees && <Loading />}
      {employees.length > 0 && (
        <form
          style={{
            margin: "0 auto",
            maxWidth: "720px",
          }}
          onSubmit={handleOnSubmit}
        >
          <Flex direction="column">
            <FormControl id="employee">
              <FormLabel>Employee</FormLabel>
              <Select
                onChange={(e) => {
                  setSelectedEmployee(e.currentTarget.value);
                }}
                placeholder="Select Employee"
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={`${employee.id}`}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Reviewers</FormLabel>
              <CheckboxGroup
                value={reviewersValues}
                onChange={setReviewersValues}
                colorScheme="green"
              >
                <Flex direction="column">
                  {employees.map(
                    (employee) =>
                      employee.id !== Number.parseInt(selectedEmployee, 10) && (
                        <Checkbox key={employee.id} value={`${employee.id}`}>
                          {employee.firstName} {employee.lastName}
                        </Checkbox>
                      )
                  )}
                </Flex>
              </CheckboxGroup>
            </FormControl>
          </Flex>
          <Flex mt={4} direction="row">
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => router.push("/dashboard/reviews")}
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
