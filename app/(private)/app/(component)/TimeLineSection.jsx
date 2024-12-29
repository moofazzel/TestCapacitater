"use client";

import { useCallback, useMemo, useState } from "react";

import { MouseTracker } from "@/components/MousePointer";
import { useScrollToCurrentDate } from "@/hooks/useScrollToCurrentDate";
import { useSyncHorizontalScroll } from "@/hooks/useSyncScroll";
import { useRef } from "react";
import DealsTimeline from "./Deals/DealsTimeline";
import FilterAndSearchHeader from "./Deals/FilterAndSearchHeader";
import GridCalendarColorKey from "./GridCalendarColorKey";
import ResizableTimeline from "./ResizableTimeline";
import ResourcesTimeline from "./Resources/ResourcesTimeline";

export default function TimeLineSection({
  dataByDealOwners,
  allResources,
  resourcesForDeals,
  resourcesData,
  totalResourcesLength,
  allDealStages,
}) {
  const containerWrapperRef = useRef(null);
  const dealsContentRef = useRef(null);
  const resourcesContentRef = useRef(null);

  // hook to sync scroll between the DealsTimeline content and ResourcesTimeline content
  useSyncHorizontalScroll(dealsContentRef, resourcesContentRef);

  const [isOwnerAscending, setIsOwnerAscending] = useState(true); // Owner sorting order
  const [isDealClientAscending, setIsDealClientAscending] = useState(true); // Deal sorting order

  const [selectedOwners, setSelectedOwners] = useState(
    dataByDealOwners.map((owner) => owner.owner) // Default: all owners selected
  );

  // state for filter resources data by category
  const [selectedCategories, setSelectedCategories] = useState(
    () =>
      JSON.parse(localStorage.getItem("selectedCategories")) ||
      Object.keys(resourcesData).map((name) => resourcesData[name].category)
  );

  // Initialize selected deal stages from localStorage or select all stages
  const [selectedDealStages, setSelectedDealStages] = useState(
    () =>
      JSON.parse(localStorage.getItem("selectedDealStages")) ||
      Object.keys(resourcesData).map((name) => resourcesData[name].category)
  );

  useScrollToCurrentDate(dealsContentRef, resourcesContentRef);

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
    let filteredData = dataByDealOwners;

    // Step 1: Filter by selected owners
    if (selectedOwners.length > 0) {
      filteredData = filteredData.filter((owner) =>
        selectedOwners.includes(owner.owner)
      );
    }

    // Step 2: Apply Deal Stage filter
    if (selectedDealStages && selectedDealStages.length > 0) {
      filteredData = filteredData
        .map((owner) => ({
          ...owner,
          deals: owner.deals.filter((deal) =>
            selectedDealStages.includes(deal["Deal Stage"])
          ),
        }))
        .filter((owner) => owner.deals.length > 0); // Only keep owners with matching deals
    }

    // Step 3: Sort owners by name
    filteredData.sort((a, b) => {
      const comparison = a.owner.localeCompare(b.owner);
      return isOwnerAscending ? comparison : -comparison;
    });

    // Step 4: Sort deals by client within each owner
    filteredData = filteredData.map((owner) => ({
      ...owner,
      deals: owner.deals.sort((a, b) => {
        const comparison = a.Client.localeCompare(b.Client);
        return isDealClientAscending ? comparison : -comparison;
      }),
    }));

    // Step 5: Apply search filter if search value is present
    if (searchValue) {
      filteredData = filteredData.filter((owner) =>
        owner.owner.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return filteredData;
  }, [
    dataByDealOwners,
    selectedOwners,
    selectedDealStages,
    searchValue,
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

  const handleDealStageFilterChange = (filteredDealStages) => {
    setSelectedDealStages(filteredDealStages);
  };

  // Memoized data that filters by category or job role
  // Filter resources by selected categories
  const filteredResourcesData = useMemo(() => {
    return Object.fromEntries(
      Object.entries(resourcesData).filter(([name, data]) =>
        selectedCategories.includes(data.category)
      )
    );
  }, [resourcesData, selectedCategories]);

  const handleResourcesCategoryFilterChange = useCallback((newCategories) => {
    setSelectedCategories(newCategories);
  }, []);

  return (
    <>
      <div className="flex items-center gap-5 mb-8 xl:mb-10">
        <FilterAndSearchHeader
          onSortByDealOwner={handleSortByOwner}
          onSortByDealClient={handleSortByDealsClient}
          onCategoryFilterChange={handleCategoryFilterChange}
          onDealStageFilterChange={handleDealStageFilterChange} // Add deal stage filter handler
          ownerNames={ownerNames}
          allDealStages={allDealStages}
          isOwnerAscending={isOwnerAscending}
          isDealClientAscending={isDealClientAscending}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <GridCalendarColorKey allDealStages={allDealStages} />
      </div>

      <div ref={containerWrapperRef}>
        <div className="relative mouseTracker">
          {/* Mouse Tracker Component */}
          <MouseTracker
            containerWrapperRef={containerWrapperRef}
            containerRef={dealsContentRef}
            resourcesRef={resourcesContentRef}
          />
          {/* Deals Timeline */}
          <DealsTimeline
            contentRef={dealsContentRef}
            dataByDealOwners={filteredAndSortedData} // Filtered and sorted data
            allResources={allResources}
            resourcesData={resourcesData}
            totalResourcesLength={totalResourcesLength}
            onResourcesCategoryFilterChange={
              handleResourcesCategoryFilterChange
            } // Filter resources by selected categories
          />
          <ResizableTimeline>
            {/* Resources Timeline */}
            <ResourcesTimeline
              contentRef={resourcesContentRef}
              resourcesForDeals={resourcesForDeals}
              resourcesData={filteredResourcesData}
              totalResourcesLength={totalResourcesLength}
            />
          </ResizableTimeline>
        </div>
      </div>
    </>
  );
}
