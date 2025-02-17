import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Comment } from "@/models/comments-model";
import { DealLog } from "@/models/DealLogSchema";
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

    // Fetch comments for the deal
    const comments = await Comment.find({ dealId })
      .populate({
        path: "userId",
        select: "name email", // Include user name and email
      })
      .lean();

    // Fetch deal logs for the deal
    const dealLogs = await DealLog.find({ dealId })
    .lean();

    // Combine comments and deal logs in the response
    const response = {
      comments,
      dealLogs,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
