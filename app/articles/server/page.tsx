import { db } from "@/src/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import React from "react";

type Props = {};

const NotesPage = async (props: Props) => {
  const supabase = createClient();
  const { data: articles } = await supabase.from("articles").select();
  //const articles = await db.articles.findMany();

  return <pre>{JSON.stringify(articles, null, 2)}</pre>;
};

export default NotesPage;
