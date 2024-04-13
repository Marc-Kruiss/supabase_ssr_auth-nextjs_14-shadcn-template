"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

// Erstellen eines Zod-Schemas für das Formular
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Provide a valid email address" })
    .email("Invalid email address"),
});

export default function EmailRecoveryPage() {
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const [state, setState] = useState<"default" | "resetting">("default");

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setState("resetting");
    const response = await supabase.auth
      .updateUser({ email: values.email })
      .then(() => {
        router.push("/login");
      })
      .catch(() => {
        console.error("error-token-expired");
        setState("default");
      });

    console.log(response);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter new email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={state === "resetting"}>
          Reset Email
        </Button>
      </form>
    </Form>
  );
}
