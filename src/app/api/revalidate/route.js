import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  const secret = request.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await request.json();

    if (slug) {
      revalidatePath(`/news/${slug}`);
    }
    revalidatePath("/news");
    revalidatePath("/");

    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
