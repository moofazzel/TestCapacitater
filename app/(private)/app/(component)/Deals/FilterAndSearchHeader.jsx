"use client";

import FilterIcon from "@/components/icons/FilterIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";

import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import { useCallback, useEffect, useRef, useState } from "react";
import CustomSearchInput from "../CustomSearchInput";

const FilterAndSearchHeader = ({
  onSortByDealOwner,
  onSortByDealClient,
  onCategoryFilterChange,
  onDealStageFilterChange,
  ownerNames, // List of all owner names
  allDealStages, // List of all deal stages
  isOwnerAscending,
  isDealClientAscending,
  searchValue,
  setSearchValue,
  onCustomFieldFilterChange,
  customFieldName,
  customFieldValues,
  dealOwnerColumnNames,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Load initial owner filter from localStorage
  const getInitialOwnerFilter = () => {
    const savedFilter =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedOwners")
        : null;
    return savedFilter ? new Set(JSON.parse(savedFilter)) : new Set([]);
  };

  // Load initial deal stage filter from localStorage
  const getInitialDealStageFilter = () => {
    const savedDealStageFilter =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedDealStages")
        : null;
    return savedDealStageFilter
      ? new Set(JSON.parse(savedDealStageFilter))
      : new Set([]);
  };

  // load category colors from context
  const { categoryColors = [] } = useCategoryColorKey();

  const [categoryFilter, setCategoryFilter] = useState(getInitialOwnerFilter);
  const [dealStageFilter, setDealStageFilter] = useState(
    getInitialDealStageFilter
  );

  const [selectedCustomFields, setSelectedCustomFields] = useState(new Set());

  useEffect(() => {
    const savedFilter =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedCustomFields")
        : null;
    setSelectedCustomFields(
      savedFilter ? new Set(JSON.parse(savedFilter)) : new Set()
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selectedCustomFields",
      JSON.stringify([...selectedCustomFields])
    );
    onCustomFieldFilterChange([...selectedCustomFields]); // Sync filter to parent component
  }, [selectedCustomFields, onCustomFieldFilterChange]);

  const onCategoryFilterChangeRef = useRef(onCategoryFilterChange);
  const onDealStageFilterChangeRef = useRef(onDealStageFilterChange);

  // Update refs whenever the props change
  useEffect(() => {
    onCategoryFilterChangeRef.current = onCategoryFilterChange;
  }, [onCategoryFilterChange]);

  useEffect(() => {
    onDealStageFilterChangeRef.current = onDealStageFilterChange;
  }, [onDealStageFilterChange]);

  // Trigger parent component when the owner filter changes
  useEffect(() => {
    onCategoryFilterChangeRef.current([...categoryFilter]); // Use the ref
    localStorage.setItem("selectedOwners", JSON.stringify([...categoryFilter]));
  }, [categoryFilter]);

  // Trigger parent component when the deal stage filter changes
  useEffect(() => {
    onDealStageFilterChangeRef.current([...dealStageFilter]); // Use the ref
    localStorage.setItem(
      "selectedDealStages",
      JSON.stringify([...dealStageFilter])
    );
  }, [dealStageFilter]);

  const onSearchChange = useCallback(
    (value) => {
      setSearchValue(value || "");
    },
    [setSearchValue]
  );

  const onClear = useCallback(() => {
    setSearchValue("");
  }, [setSearchValue]);

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      !e.target.closest(".sketch-picker") // Prevents SketchPicker clicks from closing immediately
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex gap-2 lg:gap-[10px] " ref={dropdownRef}>
      {/* Search bar */}
      <CustomSearchInput
        placeholder="Search"
        startContent={<SearchIcon />}
        value={searchValue}
        onChange={onSearchChange}
        onClear={onClear}
      />
      <div className="flex gap-2">
        {/* Deal owner filter */}
        <Dropdown radius="none" shadow="lg">
          <DropdownTrigger className="flex">
            <Button
              className=" text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[19px] xl:py-[29px] border border-color5 px-5 shadow-sm  custom-shadow"
              variant="flat"
              radius="none"
            >
              {dealOwnerColumnNames[0]}
              <span className="lg:ml-2">
                <FilterIcon />
              </span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Filter by owner name"
            closeOnSelect={false}
            selectedKeys={categoryFilter}
            selectionMode="multiple"
            onSelectionChange={setCategoryFilter}
            style={{
              maxHeight: "450px",
              overflowY: "auto",
            }}
          >
            <DropdownItem
              color="danger"
              onPress={() => setCategoryFilter(new Set(ownerNames))}
              className="capitalize rounded-none text-danger "
            >
              reset
            </DropdownItem>
            <DropdownItem
              color="warning"
              onPress={() => setCategoryFilter(new Set())}
              className="capitalize rounded-none text-warning"
            >
              Deselect all
            </DropdownItem>
            {ownerNames.map((owner) => (
              <DropdownItem
                key={owner}
                className="capitalize rounded-none custom-svg-color"
              >
                {owner}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {/* Custom Field Filter Dropdown (e.g., "Location") */}
        {customFieldName && (
          <Dropdown radius="none" shadow="lg">
            <DropdownTrigger className="flex">
              <Button
                className="text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[19px] xl:py-[29px] border border-color5 px-5 shadow-sm custom-shadow"
                variant="flat"
                radius="none"
              >
                {customFieldName}
                <span className="lg:ml-2">
                  <FilterIcon />
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label={`Filter by ${customFieldName}`}
              closeOnSelect={false}
              selectedKeys={selectedCustomFields}
              selectionMode="multiple"
              onSelectionChange={setSelectedCustomFields}
              style={{ maxHeight: "450px", overflowY: "auto" }}
            >
              <DropdownItem
                color="danger"
                onPress={() =>
                  setSelectedCustomFields(new Set(customFieldValues))
                }
                className="capitalize rounded-none text-danger"
              >
                Reset
              </DropdownItem>
              <DropdownItem
                color="warning"
                onPress={() => setSelectedCustomFields(new Set())}
                className="capitalize rounded-none text-warning"
              >
                Deselect all
              </DropdownItem>
              {customFieldValues.map((value) => (
                <DropdownItem
                  key={value}
                  className="capitalize rounded-none custom-svg-color"
                >
                  {value}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default FilterAndSearchHeader;

// {
//   /*  filters */
// }
// <div className="relative">
//   <Button
//     onClick={toggleDropdown}
//     className="custom-shadow text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[28px] border border-color5 px-5 "
//     variant="flat"
//     radius="none"
//   >
//     Filters
//     <span className="lg:ml-2">
//       <FilterIcon />
//     </span>
//   </Button>

//   {/* Dropdown content */}
//   {isOpen && (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -10 }}
//         transition={{ duration: 0.3 }}
//         className="absolute left-0 z-[100] p-5 bg-white border border-color5 top-[70px] w-max custom-shadow flex items-center gap-5"
//       >
//         <div>
//           <p>Filter by</p>
//           <div className="flex gap-3">
//             {/* Deal owner filter */}
//             <Dropdown radius="none" shadow="lg">
//               <DropdownTrigger className="flex">
//                 <Button
//                   className=" text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px] border border-color5 px-5 "
//                   variant="flat"
//                   radius="none"
//                 >
//                   Deal Owner Filter
//                   <span className="lg:ml-2">
//                     <FilterIcon />
//                   </span>
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Filter by owner name"
//                 closeOnSelect={false}
//                 selectedKeys={categoryFilter}
//                 selectionMode="multiple"
//                 onSelectionChange={setCategoryFilter}
//                 style={{
//                   maxHeight: "450px",
//                   overflowY: "auto",
//                 }}
//               >
//                 <DropdownItem
//                   color="danger"
//                   onPress={() => setCategoryFilter(new Set(ownerNames))}
//                   className="capitalize rounded-none text-danger "
//                 >
//                   reset
//                 </DropdownItem>
//                 <DropdownItem
//                   color="warning"
//                   onPress={() => setCategoryFilter(new Set())}
//                   className="capitalize rounded-none text-warning"
//                 >
//                   Deselect all
//                 </DropdownItem>
//                 {ownerNames.map((owner) => (
//                   <DropdownItem
//                     key={owner}
//                     className="capitalize rounded-none custom-svg-color"
//                   >
//                     {owner}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//             {/* Deal stage filter */}
//             <Dropdown radius="none" shadow="lg">
//               <DropdownTrigger className="flex">
//                 <Button
//                   className=" text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px] border border-color5 px-5 "
//                   variant="flat"
//                   radius="none"
//                 >
//                   Deal Stage Filter
//                   <span className="ml-2">
//                     <FilterIcon />
//                   </span>
//                 </Button>
//               </DropdownTrigger>
//               <DropdownMenu
//                 disallowEmptySelection
//                 aria-label="Filter by deal stage"
//                 closeOnSelect={false}
//                 selectedKeys={dealStageFilter}
//                 selectionMode="multiple"
//                 onSelectionChange={setDealStageFilter}
//                 style={{
//                   maxHeight: "450px",
//                   overflowY: "auto",
//                 }}
//               >
//                 <DropdownItem
//                   color="danger"
//                   onPress={() => setDealStageFilter(new Set(allDealStages))}
//                   className="capitalize rounded-none text-danger "
//                 >
//                   reset
//                 </DropdownItem>
//                 <DropdownItem
//                   color="warning"
//                   onPress={() => setDealStageFilter(new Set())}
//                   className="capitalize rounded-none text-warning"
//                 >
//                   Deselect all
//                 </DropdownItem>
//                 {allDealStages.map((stage) => (
//                   <DropdownItem
//                     key={stage}
//                     className="capitalize rounded-none custom-svg-color"
//                     style={{
//                       backgroundColor: getColor(stage),
//                     }}
//                   >
//                     {stage}
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </Dropdown>
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   )}
// </div>;

// const getColor = (dealStage, border = false) => {
//   const colorKey = categoryColors.find(
//     (item) => item.name.toLowerCase() === dealStage.toLowerCase()
//   );

//   let baseColor = colorKey?.bgColor || "#d8d7dc";

//   // If a border is required, adjust the color
//   if (border) {
//     baseColor = darken(0.2, baseColor); // Darkens the color by 20%
//   }

//   return baseColor;
// };

// const toggleDropdown = () => {
//   setIsOpen(!isOpen);
// };
