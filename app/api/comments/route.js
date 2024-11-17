import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Comment } from "@/models/comments-model";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  const dealId = request.nextUrl.searchParams.get("dealId");

  if (!dealId) {
    return new Response("dealId query parameter is required", { status: 400 });
  }

  await dbConnect();

  try {
    const { user } = await auth();

    if (!user) {
      throw new Error("Unauthorized access");
    }

    const comments = await Comment.find({ dealId })
      .populate({
        path: "userId",
        select: "name email",
      })
      .lean();

    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
