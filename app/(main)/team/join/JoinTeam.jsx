"use client";

import joinIcon from "@/public/assets/joinPageIcon.svg";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function JoinTeam() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const ownerName = searchParams.get("team");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleVerifyToken = async () => {
    if (!token) {
      toast.error(
        "Invalid or missing token. Please check your invitation link."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/team/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join team.");
      }

      const { email } = await response.json();
      router.push(`/team/login?email=${email}`);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container flex flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-4xl font-bold">Join Team</h1>
      <h2>
        {ownerName
          ? `You’ve been invited to collaborate on ${ownerName}’s Team.`
          : "You’ve been invited to join a team."}
      </h2>
      <Image src={joinIcon} alt="Join Team" priority />
      <Button
        onClick={handleVerifyToken}
        disabled={loading}
        radius="none"
        size="lg"
        isLoading={loading}
        className="mt-10 bg-color5"
      >
        {loading ? "Verifying..." : "Join Team"}
      </Button>
    </section>
  );
}
