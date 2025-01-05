import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  throw new Error("Error: DATABASE_URL is required!");
}

export default defineConfig({
  dbCredentials: { url: DATABASE_URL },
  dialect: "postgresql",
  schema: "./db/schema.ts",
});

// I an creating a platform which is like a ATS but much more powerful, in this platform user can connect other job posting platforms like indeed, lever and other job boards. when user connect those job platforms in our platofrm we fetch all the applications and applicates and store it in our database, there are two pages for all job posts and all applicates who applied for jobs. we cross reference all the jobs to platform and users to application and from which platofrm it comes from, and we sync from all other platforms to get the latest and new applicates and store them, we never delete applicantes tho.
// Now other main feature of our application is matchmaking, we are going to use openai for that, for now we arew thinking to do this using these steps:
// 1. When we get any new applicat we Tag and Categorize Applicants (Onboarding New Applicants)
// 2. Use RAG for Job Matching - Retrieval-Augmented Generation (RAG) enhances LLM capabilities by pairing it with a search mechanism (e.g., vector databases like Pinecone, Weaviate, or Elasticsearch).
// 3. Function Calling for Custom Logic Use OpenAI’s function calling to add logic for custom filtering or enrichment during the matching process:
// Skill Gap Analysis: Highlight missing skills in applicants.
// Weight Adjustments: Modify matches based on recruiter preferences, like prioritizing local candidates.
// 4. Dynamic Scoring System - Combine the RAG output with additional factors:
// Applicant’s availability.
// Salary expectations.
// Proximity to job location.
// Soft skills alignment (GPT-4 can assess this through text responses or cover letters).
