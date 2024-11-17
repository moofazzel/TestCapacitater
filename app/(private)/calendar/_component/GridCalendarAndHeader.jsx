"use client";

import { useMemo, useState } from "react";
import GridCalendar from "./GridCalendar";
import GridCalendarColorKey from "./GridCalendarColorKey";
import GridCalenderHeader from "./GridCalenderHeader";

function GridCalendarAndHeader({
  dataByDealOwners,
  resourcesData,
  allResources,
  totalResourcesLength,
  resourcesForDeals,
}) {
  const [isOwnerAscending, setIsOwnerAscending] = useState(true); // Owner sorting order
  const [isDealClientAscending, setIsDealClientAscending] = useState(true); // Deal sorting order
  const [selectedOwners, setSelectedOwners] = useState(
    dataByDealOwners.map((owner) => owner.owner) // Default: all owners selected
  );

  // State to set the search value
  const [searchValue, setSearchValue] = useState("");

  // Memoize the sorted owner names for the dropdown
  const ownerNames = useMemo(() => {
    return dataByDealOwners
      .map((owner) => owner.owner)
      .sort((a, b) => a.localeCompare(b)); // Sort owner names alphabetically
  }, [dataByDealOwners]); // Only recalculate if dataByDealOwners changes

  // Memoized data that filters by selected owners and sorts
  const filteredAndSortedData = useMemo(() => {
    // Filter owners by selected ones
    let filteredData = dataByDealOwners.filter((owner) =>
      selectedOwners.includes(owner.owner)
    );

    // Sort owners based on the sorting order
    filteredData.sort((a, b) => {
      const comparison = a.owner.localeCompare(b.owner);
      return isOwnerAscending ? comparison : -comparison;
    });

    // Sort deals within each owner clients
    filteredData = filteredData.map((owner) => ({
      ...owner,
      deals: [...owner.deals].sort((a, b) => {
        const comparison = a.Client.localeCompare(b.Client);
        return isDealClientAscending ? comparison : -comparison;
      }),
    }));

    // search by owner name
    if (searchValue) {
      filteredData = dataByDealOwners.filter((owner) =>
        owner.owner.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filteredData;
  }, [
    dataByDealOwners,
    searchValue,
    selectedOwners,
    isOwnerAscending,
    isDealClientAscending,
  ]);

  const handleSortByOwner = () => {
    setIsOwnerAscending((prev) => !prev); // Toggle owner sorting order
  };

  const handleSortByDealsClient = () => {
    setIsDealClientAscending((prev) => !prev); // Toggle deal project sorting order
  };

  const handleCategoryFilterChange = (filteredCategories) => {
    setSelectedOwners(filteredCategories); // Update selected owners
  };

  return (
    <>
      <div className="container flex items-center justify-between gap-5 mb-8 ">
        <GridCalenderHeader
          onSortByDealOwner={handleSortByOwner}
          onSortByDealClient={handleSortByDealsClient}
          onCategoryFilterChange={handleCategoryFilterChange}
          ownerNames={ownerNames} // List of all owner names for the dropdown
          isOwnerAscending={isOwnerAscending}
          isDealClientAscending={isDealClientAscending}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <GridCalendarColorKey />
      </div>
      <GridCalendar
        dataByDealOwners={filteredAndSortedData} // Filtered and sorted data
        allResources={allResources}
        resourcesForDeals={resourcesForDeals}
        resourcesData={resourcesData}
        totalResourcesLength={totalResourcesLength}
      />
    </>
  );
}

export default GridCalendarAndHeader;
