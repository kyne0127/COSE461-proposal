import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    image: string;
  }>;
};

function getContentType(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

export async function GET(_: Request, context: RouteContext) {
  const { image } = await context.params;
  const base = path.basename(image);

  if (!/^[A-Za-z0-9._-]+\.(png|jpg|jpeg|webp|gif)$/i.test(base)) {
    return NextResponse.json({ error: "Invalid image name" }, { status: 400 });
  }

  const imagePath = path.join(process.cwd(), "docs", "img", base);

  try {
    const file = await readFile(imagePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": getContentType(base),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
