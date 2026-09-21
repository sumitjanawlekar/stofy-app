import { NextResponse } from "next/server";
import { getActiveStories } from "@/src/services/story.service";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const stories = await getActiveStories();
    return NextResponse.json({ stories });
  } catch (error) {
    console.error("[api/stories] Failed to fetch stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 },
    );
  }
}
