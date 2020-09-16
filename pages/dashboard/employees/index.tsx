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
} from "@chakra-ui/core";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

import { useAPI } from "utils/use-api";
import Link from "next/link";

export type Employee = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export default function Employees() {
  const { get, delete: remove, response, loading } = useAPI();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [employees, setEmployees] = useState([]);
  const router = useRouter();

  const selectedEmployee = useRef<Employee>(null);

  useEffect(() => {
    const getEmployees = async () => {
      const initialEmployeesList = await get("/employees");

      if (response.ok) setEmployees(initialEmployeesList);
    };

    getEmployees();
  }, []);

  function DeleteUserAlert() {
    const cancelRef = useRef();
    const employee = selectedEmployee.current;

    return (
      employee && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete {employee.firstName} {employee.lastName}
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
                    await remove(`/employees/${employee.id}`);

                    if (response.ok) {
                      setEmployees((employees) =>
                        employees.filter((user) => user.id !== employee.id)
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
      {loading && employees.length < 0 && <Loading />}
      {employees.length > 0 && (
        <>
          <Flex justifyContent="space-between">
            <Heading>Employees</Heading>
            <Button
              onClick={() => {
                router.push("/dashboard/employees/add");
              }}
              colorScheme="blue"
            >
              <AddIcon mr={2} /> Add Employee
            </Button>
          </Flex>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>
                    <Flex justifyContent="center">
                      <Link
                        href={`/dashboard/employees/[id]`}
                        as={`/dashboard/employees/${employee.id}`}
                      >
                        <IconButton
                          colorScheme="blue"
                          aria-label="Edit Employee"
                          size="lg"
                          icon={<EditIcon />}
                        />
                      </Link>

                      <IconButton
                        onClick={() => {
                          selectedEmployee.current = employee;
                          onOpen();
                        }}
                        ml={8}
                        colorScheme="red"
                        aria-label="Delete Employee"
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
          <DeleteUserAlert />
        </>
      )}
    </div>
  );
}
