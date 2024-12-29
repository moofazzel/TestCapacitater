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

import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { useCategoryColorKey } from "@/context/CategoryColorKeyContext";
import { AnimatePresence, motion } from "framer-motion";
import { darken } from "polished";
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

  const getColor = (dealStage, border = false) => {
    const colorKey = categoryColors.find(
      (item) => item.name.toLowerCase() === dealStage.toLowerCase()
    );

    let baseColor = colorKey?.bgColor || "#d8d7dc";

    // If a border is required, adjust the color
    if (border) {
      baseColor = darken(0.2, baseColor); // Darkens the color by 20%
    }

    return baseColor;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Trigger parent component when the owner filter changes
  useEffect(() => {
    onCategoryFilterChange([...categoryFilter]); // Send to parent
    localStorage.setItem("selectedOwners", JSON.stringify([...categoryFilter]));
  }, [categoryFilter]);

  // Trigger parent component when the deal stage filter changes
  useEffect(() => {
    onDealStageFilterChange([...dealStageFilter]); // Send to parent
    localStorage.setItem(
      "selectedDealStages",
      JSON.stringify([...dealStageFilter])
    );
  }, [dealStageFilter]);

  const onSearchChange = useCallback((value) => {
    setSearchValue(value || "");
  }, []);

  const onClear = useCallback(() => {
    setSearchValue("");
  }, []);

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

      {/*  filters */}
      <div className="relative">
        <Button
          onClick={toggleDropdown}
          className="custom-shadow text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[28px] border border-color5 px-5 "
          variant="flat"
          radius="none"
        >
          Filters
          <span className="lg:ml-2">
            <FilterIcon />
          </span>
        </Button>

        {/* Dropdown content */}
        {isOpen && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 z-[100] p-5 bg-white border border-color5 top-[70px] w-max custom-shadow flex items-center gap-5"
            >
              <div>
                <p>Filter by</p>
                <div className="flex gap-3">
                  {/* Deal owner filter */}
                  <Dropdown radius="none" shadow="lg">
                    <DropdownTrigger className="flex">
                      <Button
                        className=" text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px] border border-color5 px-5 "
                        variant="flat"
                        radius="none"
                      >
                        Deal Owner Filter
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
                  {/* Deal stage filter */}
                  <Dropdown radius="none" shadow="lg">
                    <DropdownTrigger className="flex">
                      <Button
                        className=" text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px] border border-color5 px-5 "
                        variant="flat"
                        radius="none"
                      >
                        Deal Stage Filter
                        <span className="ml-2">
                          <FilterIcon />
                        </span>
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="Filter by deal stage"
                      closeOnSelect={false}
                      selectedKeys={dealStageFilter}
                      selectionMode="multiple"
                      onSelectionChange={setDealStageFilter}
                      style={{
                        maxHeight: "450px",
                        overflowY: "auto",
                      }}
                    >
                      <DropdownItem
                        color="danger"
                        onPress={() =>
                          setDealStageFilter(new Set(allDealStages))
                        }
                        className="capitalize rounded-none text-danger "
                      >
                        reset
                      </DropdownItem>
                      <DropdownItem
                        color="warning"
                        onPress={() => setDealStageFilter(new Set())}
                        className="capitalize rounded-none text-warning"
                      >
                        Deselect all
                      </DropdownItem>
                      {allDealStages.map((stage) => (
                        <DropdownItem
                          key={stage}
                          className="capitalize rounded-none custom-svg-color"
                          style={{
                            backgroundColor: getColor(stage),
                          }}
                        >
                          {stage}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              <div>
                {/* Deal Owner Sort */}
                <p>Sort by</p>
                <div className="flex gap-3">
                  <Button
                    className="  flex-1 text-color03 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px] border border-color5 "
                    onPress={onSortByDealOwner}
                    endContent={
                      <ChevronDownIcon
                        className={` transition-transform w-7 ${
                          isOwnerAscending ? "" : "rotate-180"
                        }`}
                      />
                    }
                    radius="none"
                    disableRipple
                  >
                    Deal Owner Sort
                  </Button>

                  {/* Deal Client Sort */}
                  <Button
                    className=" flex-1 min-w-fit text-color03 bg-white  border border-color5 text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px]"
                    onPress={onSortByDealClient}
                    endContent={
                      <ChevronDownIcon
                        className={` transition-transform w-6 ${
                          isDealClientAscending ? "" : "rotate-180"
                        }`}
                      />
                    }
                    radius="none"
                    disableRipple
                  >
                    Client Sort
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default FilterAndSearchHeader;
