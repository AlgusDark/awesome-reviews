import {
  Flex,
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Button,
  Input,
} from "@chakra-ui/core";
import { useState } from "react";
import { useRouter } from "next/router";
import type { StringOrNumber } from "@chakra-ui/utils";

import { useAPI } from "utils/use-api";
import { useEffect } from "react";
import { Loading } from "components/loading";

export default function EditReview() {
  const { get, put, response, loading } = useAPI();
  const router = useRouter();

  const [reviewersValues, setReviewersValues] = useState<StringOrNumber[]>([]);

  const [employees, setEmployees] = useState<AwesomeReviews.Employee[]>([]);

  const [selectedEmployee, setSelectedEmployee] = useState<
    AwesomeReviews.Review
  >(null);

  useEffect(() => {
    async function loadEmployees() {
      const initialEmployees = await get("/employees");
      const initialSelectedEmployee = await get(`/reviews/${router.query.id}`);

      setEmployees(initialEmployees);
      setSelectedEmployee(initialSelectedEmployee);
      setReviewersValues(
        initialSelectedEmployee.reviewers.map(
          (review) => `${review.employeeId}`
        )
      );
    }

    loadEmployees();
  }, []);

  async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (reviewersValues.length > 0 && selectedEmployee) {
      const data = {
        reviewers: reviewersValues,
      };

      await put(`/reviews/${selectedEmployee.employeeId}`, data);

      if (response.ok) {
        router.push("/dashboard/reviews");
      }
    }
  }

  return (
    <>
      {employees.length < 0 && selectedEmployee && <Loading />}
      {employees.length > 0 && selectedEmployee && (
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
              <Input
                isDisabled
                value={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Reviewers</FormLabel>
              <CheckboxGroup
                value={reviewersValues}
                onChange={setReviewersValues}
                colorScheme="green"
              >
                <Flex direction="column">
                  {employees.map((employee) => {
                    return (
                      employee.id !== selectedEmployee.employeeId && (
                        <Checkbox key={employee.id} value={`${employee.id}`}>
                          {employee.firstName} {employee.lastName}
                        </Checkbox>
                      )
                    );
                  })}
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
