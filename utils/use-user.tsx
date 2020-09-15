import { useState, useEffect } from "react";
import { createContainer } from "unstated-next";
import { useRouter } from "next/router";

type User = {
  id?: number;
  name?: string;
  role?: string;
  isLoggedIn: boolean;
};

function useHook() {
  const router = useRouter();
  const [user, setUser] = useState<User>({ isLoggedIn: false });

  useEffect(() => {
    if (!user.isLoggedIn) {
      router.replace("/login");
    }
  }, [user, router.pathname]);

  return [user, setUser] as const;
}

export const User = createContainer(useHook);
export const useUser = User.useContainer;
