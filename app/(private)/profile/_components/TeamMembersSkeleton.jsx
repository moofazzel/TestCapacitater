import { Skeleton } from "@nextui-org/react";

const TeamMembersSkeleton = () => {
  return (
    <div className="flex items-center justify-between w-full gap-3 space-y-6 ">
      <div className="flex items-center w-full gap-3 ">
        <div>
          <Skeleton className="flex w-12 h-12 rounded-full" />
        </div>
        <div className="flex flex-col w-full gap-2">
          <Skeleton className="w-3/5 h-3 rounded-lg" />
          <Skeleton className="w-4/5 h-3 rounded-lg" />
        </div>
      </div>
      <div>
        <Skeleton className="flex w-8 h-8" />
      </div>
    </div>
  );
};

export default TeamMembersSkeleton;
