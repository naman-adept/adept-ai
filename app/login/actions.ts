"use server";

import { signIn } from "@/lib/auth/auth";

export async function handleLogin(formData: FormData) {
  await signIn("credentials", {
    redirectTo: "/protected",
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
}
