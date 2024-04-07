"use server";

import { redirect } from "next/navigation";

export async function navigate(route: string) {
  redirect(route);
}
