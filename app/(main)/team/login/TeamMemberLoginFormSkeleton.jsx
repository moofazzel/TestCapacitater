"use client";

import { Skeleton, Spacer } from "@nextui-org/react";

const TeamMemberLoginSkeleton = () => {
  return (
    <div className="container max-w-full xl:max-w-[1400px] 2xl:max-w-[1536px] flex flex-col mt-28 overflow-hidden px-0">
      <div className="flex flex-col mt-12 overflow-hidden shadow-dark-gray md:flex-row mb-36">
        {/* Left Section with Skeleton */}
        <div className="p-10 md:p-32 md:w-1/2 bg-color10">
          <Skeleton className="h-[300px] w-full" />
        </div>

        {/* Right Section with Skeleton */}
        <div className="p-10 md:p-24 bg-color3 md:w-1/2">
          {/* Skeleton for Header */}
          <div className="mb-8 text-center text-white">
            <Skeleton className="w-40 mx-auto h-9" />
            <Spacer y={2} />
            <Skeleton className="mx-auto w-72 h-7" />
            <Spacer y={1} />
            <Skeleton className="h-6 mx-auto w-80" />
          </div>

          {/* Skeleton for Form */}
          <div>
            <Skeleton className="w-full h-12 mb-5" />
            <Skeleton className="w-full h-12 mb-5" />
            <Skeleton className="w-full h-12 mb-5" />
            <Skeleton className="h-10 mx-auto mt-10 w-36" />
          </div>

          {/* Skeleton for Footer */}
          <Spacer y={2} />
          <Skeleton className="w-40 h-5 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default TeamMemberLoginSkeleton;
