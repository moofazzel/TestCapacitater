import { Skeleton } from "@nextui-org/react";

function CommentSkeleton() {
  return (
    <div className="max-w-[300px] w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex w-12 h-12 rounded-full" />
      </div>
      <div className="flex flex-col w-full gap-2">
        <Skeleton className="w-3/5 h-3 rounded-lg" />
        <Skeleton className="w-4/5 h-3 rounded-lg" />
      </div>
    </div>
  );
}

export default CommentSkeleton;
