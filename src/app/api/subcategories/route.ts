import { NextRequest, NextResponse } from "next/server";
import { getSubcategories } from "@/api/services/catalogApi";

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  if (!categoryId)
    return NextResponse.json(
      { message: "Missing categoryId" },
      { status: 400 },
    );

  if (!/^[a-f\d]{24}$/i.test(categoryId))
    return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
  try {
    return NextResponse.json(await getSubcategories(categoryId));
  } catch {
    return NextResponse.json({ message: "Unable to load subcategories" }, { status: 502 });
  }
}
