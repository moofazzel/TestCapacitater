import { Skeleton } from "@nextui-org/react";

const CategoryColorKeySkeleton = () => {
  return (
    <div className="flex items-center gap-3 ">
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <div key={index} className=" w-[150px] flex items-center gap-1 ">
            <Skeleton className="size-[30px] " />
            <Skeleton className="w-full h-[30px]" />
          </div>
        ))}
    </div>
  );
};

export default CategoryColorKeySkeleton;
