import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext,
) {
 const backendBaseUrl = process.env.BACKEND_API_URL?.replace(/\/+$/, "");
  if (!backendBaseUrl) {
    return Response.json(
      { detail: "BACKEND_API_URL is not configured" },
      { status: 503 },
    );
  }

  const { path } = await params;

  const backendUrl =
    `${backendBaseUrl}/api/${path.map(encodeURIComponent).join("/")}` +
    request.nextUrl.search;

  try {
    const backendResponse = await fetch(backendUrl, {
      cache: "no-store",
    });

    const headers = new Headers();
    const contentType = backendResponse.headers.get("content-type");

    if (contentType) {
      headers.set("content-type", contentType);
    }

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      headers,
    });
  } catch (error) {
    console.error("Backend API request failed", {
      backendUrl,
      error,
    });

   return Response.json(
  {
    detail: "Backend API is unavailable",
    error: error instanceof Error ? error.message : String(error),
  },
  { status: 502 },
  );
  }
}