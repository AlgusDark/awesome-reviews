import { Flex } from "@chakra-ui/core";
import { useEffect } from "react";

import { useUser } from "utils/use-user";
import { Loader } from "components/loader";
import { useRouter } from "next/router";

export default function Home() {
  const [user] = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user.isLoggedIn) {
      if (user.role === "admin") {
        router.replace("/dashboard/employees");
      }
      if (user.role === "employee") {
        router.replace("/me");
      }
    }
  }, [user, router]);

  return (
    <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
      <Loader />
    </Flex>
  );
}