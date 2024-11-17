"use client";

import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
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
import { darken } from "polished";
import { useCallback, useEffect, useState } from "react";
import CustomSearchInput from "../../../calendar/_component/CustomSearchInput";

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
  // Load initial owner filter from localStorage
  const getInitialOwnerFilter = () => {
    const savedFilter =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedOwners")
        : null;
    return savedFilter ? new Set(JSON.parse(savedFilter)) : new Set(ownerNames);
  };

  // Load initial deal stage filter from localStorage
  const getInitialDealStageFilter = () => {
    const savedDealStageFilter =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedDealStages")
        : null;
    return savedDealStageFilter
      ? new Set(JSON.parse(savedDealStageFilter))
      : new Set(allDealStages);
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

  return (
    <div className="flex gap-[8px] flex-wrap lg:flex-nowrap lg:gap-[10px] xl:gap-[15px]">
      {/* Search bar */}
      <CustomSearchInput
        placeholder="Search by owner name..."
        startContent={<SearchIcon />}
        value={searchValue}
        onChange={onSearchChange}
        onClear={onClear}
      />

      {/* Owner filter */}
      <Dropdown radius="none" shadow="lg">
        <DropdownTrigger className="flex">
          <Button
            className="custom-shadow text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px] border border-color5 px-5 "
            variant="flat"
            radius="none"
          >
            Deal Owner Filter
            <span className="ml-2">
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
            className="custom-shadow text-color03 flex-1 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px] border border-color5 px-5 "
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
            onPress={() => setDealStageFilter(new Set(allDealStages))}
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

      {/* Deal Owner Sort */}
      <Button
        className=" custom-shadow flex-1 text-color03 min-w-fit bg-white text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px] border border-color5 "
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
        className="custom-shadow flex-1 min-w-fit text-color03 bg-white  border border-color5 text-[12px] lg:text-[13px] xl:text-[15px] py-[20px] xl:py-[30px]"
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
  );
};

export default FilterAndSearchHeader;
