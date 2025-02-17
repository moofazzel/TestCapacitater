"use client";

import joinIcon from "@/public/assets/joinPageIcon.svg";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

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

      const data = await response.json();

      if (data.isOwner) {
        Swal.fire({
          title: "Important Notice",
          html: `
      <p>You are currently the team lead for <strong>${data.existingOwnerName}</strong>.</p>
      <p>Joining  <strong>${ownerName}</strong>, will disable your current team data as long as you are part of the team.</p>
      <p>Use a different email to keep your current team intact.</p>
    `,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Proceed Anyways",
          confirmButtonColor: "#f39c12", // Warning color
          cancelButtonText: "Cancel",
          customClass: {
            popup: "custom-swal-width",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(`/team/login?email=${data.email}`);
          }
        });
        return;
      }

      router.push(`/team/login?email=${data.email}`);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container flex flex-col items-center justify-center gap-4 py-8">
      {/* <h1 className="text-4xl font-bold">Join Team</h1> */}
      <h2 className="text-2xl text-center">
        {ownerName ? (
          <>
            You’ve been invited to collaborate on{" "}
            <b>{ownerName || "Team Name"}</b>’s Team.
          </>
        ) : (
          "You’ve been invited to join a team."
        )}
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
