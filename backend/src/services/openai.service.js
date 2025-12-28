//NL → SQL
import OpenAI from "openai";
import { ENV } from "../config/env.js";
const openai = new OpenAI({ apiKey: ENV.OPENAI_API_KEY});

export async function nlToSql({ question, schema, dbType }) {
  const prompt = `
You are an expert SQL generator.
Database type: ${dbType}
Schema:
${schema}

Convert the following question to a READ ONLY SQL query.
Return only SQL.

Question: ${question}
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content.trim();
}
