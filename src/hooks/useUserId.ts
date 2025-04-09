import { getLocalStorage } from "@/lib/storage";
import { useEffect, useState } from "react";

export const useUserId = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const authData = getLocalStorage("authData");
    if (authData) {
      const parsedAuthData = JSON.parse(authData) as { userId: number };
      setUserId(parsedAuthData.userId);
    }
  }, []);

  return { userId };
};
