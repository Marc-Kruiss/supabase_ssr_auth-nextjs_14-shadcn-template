"use client";

import AddArticleForm from "@/components/add-article-form";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Article = { created_at: string; id: number; title: string | null };
export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("articles").select("*");
      //const articles = await db.articles.findMany();
      if (data) setArticles(data);
    };
    getData();

    const channel = supabase
      .channel("article-change")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "articles",
        },
        (payload) => {
          switch (payload.eventType) {
            case "DELETE":
              setArticles((currentArticles) => {
                const deletedId = payload.old.id;
                const newArticles = currentArticles.filter(
                  (article) => article.id !== deletedId
                );
                return newArticles;
              });
              break;
            case "UPDATE":
              setArticles((currentArticles) => {
                const updatedId = payload.new.id;
                return currentArticles.map((article) =>
                  article.id === updatedId
                    ? { ...article, ...payload.new }
                    : article
                );
              });
              break;
            case "INSERT":
              setArticles((currentArticles) => {
                const newArticle: Article = {
                  created_at: payload.new.created_at,
                  id: payload.new.id,
                  title: payload.new.title,
                };
                const exists = currentArticles.some(
                  (article) => article.id === newArticle.id
                );
                return exists
                  ? currentArticles
                  : [...currentArticles, newArticle];
              });
              break;
            default:
              // Handle other event types if necessary
              break;
          }
        }
      )
      .subscribe();
    setChannel(channel);

    // Cleanup-Funktion, die bei Unmount aufgerufen wird
    return () => {
      console.log("unsubscribe");
      channel.unsubscribe();
    };
  }, [supabase]);

  return (
    <>
      <pre>{JSON.stringify(articles, null, 2)}</pre>
      <AddArticleForm />
    </>
  );
}
