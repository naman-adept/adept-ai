"use server";

import { redirect } from "next/navigation";
import { createUser, getUser } from "@/lib/db/db";

export async function handleRegister(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const user = await getUser(email);

  if (user.length > 0) {
    return "User already exists"; // TODO: Handle errors with useFormStatus
  } else {
    await createUser(email, password);
    redirect("/login");
  }
}
