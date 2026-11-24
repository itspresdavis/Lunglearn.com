import { NextResponse } from "next/server";
import { queryCatalog } from "@/lib/catalog";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return NextResponse.json({ results: queryCatalog(query).slice(0, 20) });
}
