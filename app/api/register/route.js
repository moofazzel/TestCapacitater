import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import CategoryColor from "@/models/categoryColor-model";
import { User } from "@/models/user-model";
import { sendEmail } from "@/utils/sendEmailWithSendGrid";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  const { name, email, password } = await request.json();

  await dbConnect();

  const foundUser = await User.findOne({ email });

  if (foundUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = {
    name,
    email,
    password: hashedPassword,
  };

  try {
    const createdUser = await User.create(newUser);

    // Create the default category color entry for the new user
    await CategoryColor.create({
      userId: createdUser._id,
      categories: [
        {
          name: "all others",
          bgColor: "#d8d7dc",
        },
      ],
    });

    // new user notifications
    await sendEmail({
      to: `${process.env.NEW_USER_NOTIFICATION_EMAIL}`,
      subject: "New user (Capacitater)",
      text: "New user created",

      html: `
        <h1>New user created</h1>

        <p>Email: ${createdUser.email}</p>
        `,
    });
    return NextResponse.json(
      { message: "User has been created", userId: createdUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
