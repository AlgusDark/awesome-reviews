import { useEffect } from "react";

import { useUser } from "utils/use-user";
import { Loading } from "components/loading";
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

  return <Loading />;
}
