import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import CategoryColor from "@/models/categoryColor-model";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export const GET = async (request) => {
  await dbConnect();

  try {
    const { user } = await auth();

    if (!user) {
      throw new Error("Unauthorized access");
    }

    const categoryColors = await CategoryColor.findOne({
      userId: user.id,
    }).lean();

    return NextResponse.json(categoryColors);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
