import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm";
import { Pool } from "pg";
import { jobPlatforms, jobs } from "@/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing." },
      { status: 400 }
    );
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch(
      "https://secure.indeed.com/oauth/v2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.INDEED_CLIENT_ID,
          client_secret: process.env.INDEED_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: process.env.INDEED_REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || "Failed to fetch access token.");
    }

    // Store the access token in the database
    await db.insert(jobPlatforms).values({
      name: "Indeed",
      apiIntegrationToken: tokenData.access_token,
    });

    // Fetch jobs from Indeed
    const jobsResponse = await fetch(
      "https://api.indeed.com/v2/employer/jobs",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const jobsData = await jobsResponse.json();

    if (!jobsResponse.ok) {
      throw new Error(jobsData.error || "Failed to fetch jobs.");
    }

    // Save jobs to the database
    const jobInserts = jobsData.jobs.map((job) => ({
      platformId: 1, // Adjust platformId as per your database schema
      userId: 1, // Replace with the actual user ID
      title: job.title,
      description: job.description,
      location: job.location || "Unknown",
      salaryRange: job.salary || "Not specified",
    }));

    await db.insert(jobs).values(jobInserts);

    return NextResponse.json({ success: true, jobs: jobsData.jobs });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
