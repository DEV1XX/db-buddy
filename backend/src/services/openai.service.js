// NL → SQL with fallback (Groq → Gemini)

import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../config/env.js";

const groq = new Groq({ apiKey: ENV.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

/**
 * Build the prompt for the LLM
 */
function buildPrompt({ question, schema, dbType }) {
  return `
You are an expert SQL generator.
Database type: ${dbType}

Schema:
${schema}

Convert the following question to a READ ONLY SQL query.
Return ONLY SQL. Do NOT include any explanations or Markdown formatting.

Question: ${question}
`;
}

/**
 * Strip code fences and extra spaces from model output
 */
function cleanSQL(sql) {
  return sql
    .replace(/```sql/gi, "") // remove ```sql
    .replace(/```/g, "")     // remove ```
    .trim();
}

/**
 * Convert natural language question to SQL
 */
export async function nlToSql({ question, schema, dbType }) {
  const prompt = buildPrompt({ question, schema, dbType });

  /* -------------------- TRY GROQ FIRST -------------------- */
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    return cleanSQL(res.choices[0].message.content);
  } catch (groqError) {
    console.warn("Groq failed, switching to Gemini:", groqError.message);
  }

  /* -------------------- FALLBACK: GEMINI -------------------- */
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    return cleanSQL(result.response.text());
  } catch (geminiError) {
    console.error("Gemini failed:", geminiError.message);
    throw new Error("NL → SQL generation failed on all providers");
  }
}
