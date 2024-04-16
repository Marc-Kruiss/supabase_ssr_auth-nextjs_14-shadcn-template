import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const supabase = createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/login");
  // }
  return <div> {children}</div>;
}
