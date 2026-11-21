import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/auth";

export default function ProtectedLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/auth/login");
      }

      setIsLoading(false);
    };

    checkUser();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
