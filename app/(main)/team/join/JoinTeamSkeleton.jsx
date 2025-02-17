import { Skeleton } from "@nextui-org/react";

const JoinTeamSkeleton = () => {
  return (
    <section className="container flex flex-col items-center justify-center gap-4 py-8">
      {/* Placeholder for heading */}
      <Skeleton className="h-9 w-36" />

      {/* Placeholder for subheading */}
      <Skeleton className="h-9 w-72" />

      {/* Placeholder for an image */}
      <Skeleton className="h-24 w-36" />

      {/* Placeholder for button */}
      <Skeleton className="mt-10 h-9 w-36" />
    </section>
  );
};

export default JoinTeamSkeleton;
