import { NextResponse } from "next/server";
import { getCategories } from "@/api/services/catalogApi";

export async function GET() {
  try {
    return NextResponse.json(await getCategories());
  } catch {
    return NextResponse.json({ message: "Unable to load categories" }, { status: 502 });
  }
}
