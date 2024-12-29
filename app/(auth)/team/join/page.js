// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useState } from "react";

// import joinIcon from "@/public/assets/joinPageIcon.svg";
// import { Button } from "@nextui-org/react";
// import Image from "next/image";
// import toast from "react-hot-toast";

// export default function JoinTeamPage() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
//   const ownerName = searchParams.get("team");
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleVerifyToken = async () => {
//     if (!token) {
//       toast.error(
//         "Invalid or missing token. Please check your invitation link."
//       );
//       return;
//     }
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/team/join", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || "Failed to join team.");
//       }
//       router.push(`/team/login?email=${data}`);
//     } catch (err) {
//       toast.error(err.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       {" "}
//       <section className="container flex flex-col items-center justify-center gap-4 py-8">
//         <h1 className="text-4xl font-bold">Join Team</h1>
//         {ownerName ? (
//           <h2>
//             You&apos;ve been invited to collaborate on{" "}
//             <b className="capitalize">{ownerName}&apos;s</b> Team.
//           </h2>
//         ) : (
//           <h2>You&apos;ve been invited to collaborate on Team Name.</h2>
//         )}
//         <Image src={joinIcon} alt="Join Team" />
//         {error && <p className="text-red-500">{error}</p>}

//         <Button
//           onClick={handleVerifyToken}
//           disabled={loading}
//           radius="none"
//           size="lg"
//           isLoading={loading}
//           className="mt-10 bg-color5"
//         >
//           {loading ? "Verifying..." : "Join Team"}
//         </Button>
//       </section>
//     </Suspense>
//   );
// }

const page = () => {
  return <div>page</div>;
};

export default page;
