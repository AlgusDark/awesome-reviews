import { Box, Flex, Spacer } from "@chakra-ui/core";
import Link from "next/link";

import { ReactComponent as Logo } from "./logo.svg";
import { useUser } from "utils/use-user";
import { NavLink } from "./navlink";

export const Header: React.FunctionComponent = () => {
  const [user] = useUser();
  return (
    <Flex as="header" height="4.5rem" borderBottomWidth="1px" mb={8} px={16}>
      <Flex alignItems="center" maxWidth="1024px">
        <Box>
          <Link href="/">
            <a>
              <Flex alignItems="center" direction="row">
                <Box as={Logo} mr={1} />
                Awesome Reviews
              </Flex>
            </a>
          </Link>
        </Box>
        <Flex as="nav" ml={8}>
          {user.role === "admin" && (
            <>
              <Box>
                <NavLink href="/dashboard/employees">Employees</NavLink>
              </Box>
              <Box ml={8}>
                <NavLink href="/dashboard/reviews">Reviews</NavLink>
              </Box>
            </>
          )}
        </Flex>
      </Flex>
      {user.isLoggedIn ? (
        <Flex ml="auto" alignItems="center" direction="row">
          <Link href="/login" as="/logout">
            <a>Logout</a>
          </Link>
        </Flex>
      ) : null}
    </Flex>
  );
};
