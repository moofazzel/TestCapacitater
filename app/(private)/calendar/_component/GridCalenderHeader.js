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
import { useCallback, useEffect, useState } from "react";
import CustomSearchInput from "./CustomSearchInput";

function GridCalenderHeader({
  onSortByDealOwner,
  onSortByDealClient,
  onCategoryFilterChange,
  ownerNames, // List of all owner names
  isOwnerAscending,
  isDealClientAscending,
  searchValue,
  setSearchValue,
}) {
  // Load from localStorage if available, otherwise default to selecting all owners
  const getInitialFilter = () => {
    const savedFilter =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedOwners")
        : null;
    return savedFilter ? new Set(JSON.parse(savedFilter)) : new Set(ownerNames);
  };

  const [categoryFilter, setCategoryFilter] = useState(getInitialFilter);

  // Trigger parent component when the filter changes
  useEffect(() => {
    onCategoryFilterChange([...categoryFilter]); // Send to parent
    // Save to localStorage to persist across refreshes
    localStorage.setItem("selectedOwners", JSON.stringify([...categoryFilter]));
  }, [categoryFilter]);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setSearchValue(value);
    } else {
      setSearchValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setSearchValue("");
  }, []);

  return (
    <div className="flex gap-[15px] ">
      {/* Search bar */}
      <CustomSearchInput
        placeholder="Search by owner name..."
        startContent={<SearchIcon />}
        value={searchValue}
        onChange={onSearchChange}
        onClear={onClear}
      />

      {/* Owner filter */}
      <Dropdown>
        <DropdownTrigger className="hidden sm:flex">
          <Button
            className="custom-shadow text-color03 sm:min-w-fit bg-white !text-[15px] border border-color5 px-8 py-[30px]"
            variant="flat"
            radius="none"
          >
            Filter by Deal Owners
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
            className="capitalize text-danger"
          >
            reset
          </DropdownItem>

          <DropdownItem
            color="warning"
            onPress={() => setCategoryFilter(new Set())} // Set to an empty Set to deselect all
            className="capitalize text-warning"
          >
            Deselect all
          </DropdownItem>
          {ownerNames.map((owner) => (
            <DropdownItem key={owner} className="capitalize">
              {owner}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {/* Deal Owner */}
      <Button
        className=" custom-shadow text-color03 sm:min-w-fit bg-white !text-[15px] border border-color5 py-[30px]"
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
        Deal Owner
      </Button>

      {/* Deal Client */}
      <Button
        className="custom-shadow sm:min-w-fit text-color03 bg-white !text-[15px] border border-color5 py-[30px] "
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
        Clients
      </Button>
    </div>
  );
}

export default GridCalenderHeader;
