import { getLocalStorage } from "@/lib/storage";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<{ userId: number; email: string } | null>(
    null
  );

  useEffect(() => {
    const authData = getLocalStorage("authData");
    if (authData) {
      const parsedAuthData = JSON.parse(authData) as {
        userId: number;
        email: string;
      };
      setUser({ userId: parsedAuthData.userId, email: parsedAuthData.email });
    }
  }, []);

  return { user };
};
