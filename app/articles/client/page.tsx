"use client";

import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Page() {
  const [articles, setArticles] = useState<any[] | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("articles").select("*");
      //const articles = await db.articles.findMany();
      setArticles(articles);
    };
    getData();
  }, []);

  return <pre>{JSON.stringify(articles, null, 2)}</pre>;
}
