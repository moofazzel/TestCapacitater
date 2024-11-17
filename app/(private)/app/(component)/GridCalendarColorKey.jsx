"use client";

import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import CategoryColorKeySkeleton from "./CategoryColorKeySkeleton";
import CustomColorPickerDropdown from "./CustomColorPickerDropdown";
import UpdateCustomColorPickerDropdown from "./UpdateCustomColorPickerDropdown";

const GridCalendarColorKey = ({ allDealStages }) => {
  const { categoryColors = [], loading } = useCategoryColorKey();
  const sortedCategoryColors = categoryColors.sort((a, b) =>
    b.name.localeCompare(a.name)
  );

  return (
    <div className="flex items-center flex-wrap lg:flex-nowrap px-[15px] py-[6px] xl:py-[15px] gap-[10px] lg:gap-[10px] xl:gap-[20px] border custom-shadow border-color5 text-[10px] lg:text-[12px] 3xl:text-[16px] text-color02 ">
      {loading && <CategoryColorKeySkeleton />}

      {categoryColors &&
        !loading &&
        sortedCategoryColors?.map((item) => {
          return (
            // update existing category color
            <UpdateCustomColorPickerDropdown
              key={item._id}
              item={item}
              allDealStages={allDealStages}
            />
          );
        })}

      {/* create new category color */}
      <CustomColorPickerDropdown allDealStages={allDealStages} />
    </div>
  );
};

export default GridCalendarColorKey;
