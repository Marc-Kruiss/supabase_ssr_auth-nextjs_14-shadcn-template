"use server";

import { db } from "./prisma";

export const createArticle = async (title: string) => {
  const data = db.articles.create({ data: { title: title } });
  return data;
};
