import { NextResponse } from "next/server";

export async function GET() {
  const indeedAuthUrl = `https://secure.indeed.com/oauth/v2/authorize?client_id=${process.env.INDEED_CLIENT_ID}&redirect_uri=${process.env.INDEED_REDIRECT_URI}&response_type=code&scope=employer`;

  return NextResponse.redirect(indeedAuthUrl);
}
