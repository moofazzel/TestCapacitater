"use client";

import { useCallback, useMemo, useState } from "react";

import { MouseTracker } from "@/components/MousePointer";
import { useScrollToCurrentDate } from "@/hooks/useScrollToCurrentDate";
import { useSyncHorizontalScroll } from "@/hooks/useSyncScroll";
import { useRef } from "react";
import DealsTimeline from "./Deals/DealsTimeline";
import FilterAndSearchHeader from "./Deals/FilterAndSearchHeader";
import { FloatingSidebar } from "./FloatingSidebar";
import GridCalendarColorKey from "./GridCalendarColorKey";
import ResizableTimeline from "./ResizableTimeline";
import ResourcesTimeline from "./Resources/ResourcesTimeline";

const EXPECTED_HEADERS = [
  "Deal ID",
  "Client",
  "Project",
  "Deal Stage",
  "Start Date",
  "End Date",
  "Deal Owner",
];

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

  // Extract dynamic field name (first unknown column after EXPECTED_HEADERS)
  const allHeaders = Object.keys(dataByDealOwners[0]?.deals[0] || {});
  const knownHeaders = new Set(
    EXPECTED_HEADERS.concat(["id", "resources", "dealOwnerColumnName"])
  );

  const customFieldName = allHeaders.find(
    (header) => !knownHeaders.has(header)
  );

  // hook to sync scroll between the DealsTimeline content and ResourcesTimeline content
  useSyncHorizontalScroll(dealsContentRef, resourcesContentRef);

  const [isOwnerAscending, setIsOwnerAscending] = useState(true); // Owner sorting order
  const [isDealClientAscending, setIsDealClientAscending] = useState(true); // Deal sorting order

  // State for toggling sections
  // const [showDeals, setShowDeals] = useState(true);
  const [showResources, setShowResources] = useState(true);

  const toggleResources = () => {
    setShowResources(!showResources); // Toggle resources visibility
  };

  const [selectedOwners, setSelectedOwners] = useState(
    dataByDealOwners.map((owner) => owner.owner) // Default: all owners selected
  );

  const isBrowser = typeof window !== "undefined"; // Check if running in the browser

  const getInitialSelectedCategories = () => {
    if (isBrowser) {
      return (
        JSON.parse(localStorage.getItem("selectedCategories")) ||
        Object.keys(resourcesData).map((name) => resourcesData[name].category)
      );
    }
    return []; // Fallback to empty array during SSR
  };

  const getInitialSelectedDynamicKeys = () => {
    if (isBrowser) {
      try {
        const storedKeys = JSON.parse(
          localStorage.getItem("selectedDynamicKeys")
        );
        return storedKeys && typeof storedKeys === "object" ? storedKeys : {};
      } catch {
        return {};
      }
    }
    return {};
  };

  const getInitialSelectedDealStages = () => {
    if (isBrowser) {
      return (
        JSON.parse(localStorage.getItem("selectedDealStages")) ||
        Object.keys(resourcesData).map((name) => resourcesData[name].category)
      );
    }
    return []; // Fallback to empty array during SSR
  };

  // state for filter resources data by category
  const [selectedCategories, setSelectedCategories] = useState(
    getInitialSelectedCategories
  );

  const [selectedDynamicKeys, setSelectedDynamicKeys] = useState(
    getInitialSelectedDynamicKeys
  );

  const [activeFilter, setActiveFilter] = useState("category"); // Default to category filtering

  // Initialize selected deal stages from localStorage or select all stages
  const [selectedDealStages, setSelectedDealStages] = useState(
    getInitialSelectedDealStages
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

  const [selectedCustomFields, setSelectedCustomFields] = useState([]);

  const uniqueCustomFieldValues = useMemo(() => {
    if (!customFieldName) return [];
    return [
      ...new Set(
        dataByDealOwners.flatMap((owner) =>
          owner.deals.map((deal) => deal[customFieldName])
        )
      ),
    ].filter(Boolean);
  }, [dataByDealOwners, customFieldName]);

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

    // Step 5: Search Filter (Includes "Deal Owner" + "Project" + "Client")
    if (searchValue) {
      filteredData = filteredData
        .map((owner) => {
          const filteredDeals = owner.deals.filter(
            (deal) =>
              deal["Project"]
                ?.toLowerCase()
                .includes(searchValue.toLowerCase()) || // Matches Project Name
              deal["Client"]?.toLowerCase().includes(searchValue.toLowerCase()) // Matches Client Name
          );

          // Keep the owner if they match OR if any of their deals match (by Project Name OR Client Name)
          if (
            owner.owner.toLowerCase().includes(searchValue.toLowerCase()) || // Matches Deal Owner
            filteredDeals.length > 0 // Matches Project Name OR Client Name
          ) {
            return {
              ...owner,
              deals: filteredDeals.length > 0 ? filteredDeals : owner.deals, // If project/client matched, show those deals
            };
          }

          return null;
        })
        .filter(Boolean); // Remove any null values
    }

    // Step 6: Filter by Custom Field (if any field exists)
    if (customFieldName && selectedCustomFields.length > 0) {
      filteredData = filteredData
        .map((owner) => ({
          ...owner,
          deals: owner.deals.filter((deal) =>
            selectedCustomFields.includes(deal[customFieldName])
          ),
        }))
        .filter((owner) => owner.deals.length > 0); // Remove owners with no deals left
    }

    return filteredData;
  }, [
    dataByDealOwners,
    selectedOwners,
    selectedDealStages,
    searchValue,
    isOwnerAscending,
    isDealClientAscending,
    customFieldName,
    selectedCustomFields,
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

  const uniqueDealOwnerColumnNames = useMemo(() => {
    return [
      ...new Set(
        dataByDealOwners.flatMap((owner) =>
          owner.deals.map((deal) => deal.dealOwnerColumnName)
        )
      ),
    ].filter(Boolean);
  }, [dataByDealOwners]);

  // Filter resources by selected categories
  // const filteredResourcesData = useMemo(() => {
  //   return Object.fromEntries(
  //     Object.entries(resourcesData).filter(([name, data]) =>
  //       selectedCategories.includes(data.category)
  //     )
  //   );
  // }, [resourcesData, selectedCategories]);

  const filteredResourcesData = useMemo(() => {
    return Object.fromEntries(
      Object.entries(resourcesData).filter(([_, resource]) => {
        // CATEGORY FILTER:
        // If no categories are selected, treat it as a match; otherwise, the resource's category must be in selectedCategories.
        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.includes(resource.category);

        // DYNAMIC FILTER:
        // For each dynamic filter key, if there are selected values (converted to an array),
        // the resource must have a matching dynamicData value.
        let dynamicMatch = true;
        if (selectedDynamicKeys) {
          Object.entries(selectedDynamicKeys).forEach(([key, values]) => {
            // Convert sets to arrays if needed.
            const arrValues =
              values instanceof Set ? Array.from(values) : values;
            if (arrValues && arrValues.length > 0) {
              if (
                !resource.dynamicData ||
                !resource.dynamicData[key] ||
                !arrValues.includes(resource.dynamicData[key])
              ) {
                dynamicMatch = false;
              }
            }
          });
        }

        // Only keep the resource if it matches both category and dynamic filters.
        return categoryMatch && dynamicMatch;
      })
    );
  }, [resourcesData, selectedCategories, selectedDynamicKeys]);

  const handleResourcesCategoryFilterChange = useCallback((newCategories) => {
    console.log("🔄 Applying Category Filter:", newCategories);

    setSelectedCategories(newCategories);
    setActiveFilter("category"); // Set active filter mode to category

    localStorage.setItem("selectedCategories", JSON.stringify(newCategories));
  }, []);

  const handleResourcesDynamicFilterChange = useCallback(
    (filteredDynamicKeys) => {
      console.log("🔄 Applying Dynamic Filter:", filteredDynamicKeys);

      setSelectedDynamicKeys(filteredDynamicKeys);
      setActiveFilter("dynamic"); // Set active filter mode to dynamic

      localStorage.setItem(
        "selectedDynamicKeys",
        JSON.stringify(filteredDynamicKeys)
      );
    },
    []
  );

  return (
    <>
      <div className="flex gap-5 items-center mb-8 xl:mb-10">
        <FilterAndSearchHeader
          onSortByDealOwner={handleSortByOwner}
          onSortByDealClient={handleSortByDealsClient}
          onCategoryFilterChange={handleCategoryFilterChange}
          onDealStageFilterChange={handleDealStageFilterChange} // Add deal stage filter handler
          onCustomFieldFilterChange={setSelectedCustomFields}
          ownerNames={ownerNames}
          allDealStages={allDealStages}
          isOwnerAscending={isOwnerAscending}
          isDealClientAscending={isDealClientAscending}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          customFieldName={customFieldName}
          customFieldValues={uniqueCustomFieldValues}
          dealOwnerColumnNames={uniqueDealOwnerColumnNames}
        />
        <GridCalendarColorKey
          allDealStages={allDealStages}
          onDealStageFilterChange={handleDealStageFilterChange}
        />
      </div>

      <div ref={containerWrapperRef} style={{ minHeight: "600px" }}>
        <div className="relative mouseTracker">
          {/* Mouse Tracker Component */}
          <MouseTracker
            containerWrapperRef={containerWrapperRef}
            containerRef={dealsContentRef}
            resourcesRef={resourcesContentRef}
          />
          <DealsTimeline
            contentRef={dealsContentRef}
            dataByDealOwners={filteredAndSortedData} // Filtered and sorted data
            allResources={allResources}
            resourcesData={resourcesData}
            showResources={showResources}
            totalResourcesLength={totalResourcesLength}
            onResourcesCategoryFilterChange={
              handleResourcesCategoryFilterChange
            } // Filter resources by selected categories
            onResourcesDynamicFilterChange={handleResourcesDynamicFilterChange}
          />
          {showResources ? (
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showResources
                  ? "opacity-100 max-h-[600px]"
                  : "max-h-0 opacity-0"
              }`}
            >
              <ResizableTimeline height={315}>
                <ResourcesTimeline
                  contentRef={resourcesContentRef}
                  resourcesForDeals={resourcesForDeals}
                  resourcesData={filteredResourcesData}
                  totalResourcesLength={totalResourcesLength}
                />
              </ResizableTimeline>
            </div>
          ) : (
            <div className="max-h-0 opacity-0 transition-all duration-500 ease-in-out"></div>
          )}

          {/* Floating Button for Show/Hide Resources */}
          <FloatingSidebar toggleResources={toggleResources} />
        </div>
      </div>
    </>
  );
}
