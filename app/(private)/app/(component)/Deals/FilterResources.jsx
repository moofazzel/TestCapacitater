"use client";

import FilterIcon from "@/components/icons/FilterIcon";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button, Checkbox, CheckboxGroup } from "@nextui-org/react";

function FilterResources({
  resourcesData,
  onFilterChange,
  onDynamicFilterChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const filterContentRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const filterRef = useRef(null);

  const uniqueCategories = useMemo(() => {
    return [
      ...new Set(Object.values(resourcesData).map((data) => data.category)),
    ];
  }, [resourcesData]);
  const uniqueDynamicData = useMemo(() => {
    const dynamicGroups = {};
    Object.values(resourcesData).forEach((resource) => {
      if (resource.dynamicData) {
        Object.entries(resource.dynamicData).forEach(([key, value]) => {
          if (key.toLowerCase() === "id") return; // Ignore 'id' key
          if (value === "") return; // Skip empty strings
          if (!dynamicGroups[key]) dynamicGroups[key] = new Set();
          dynamicGroups[key].add(value);
        });
      }
    });
    return Object.fromEntries(
      Object.entries(dynamicGroups).map(([key, values]) => [key, [...values]])
    );
  }, [resourcesData]);

  console.log("🚀 ~ uniqueDynamicData:", uniqueDynamicData);

  const getInitialFilter = (key, defaultValues) => {
    if (typeof window === "undefined") return new Set(defaultValues);
    try {
      const savedFilter = JSON.parse(localStorage.getItem(key));
      return savedFilter ? new Set(savedFilter) : new Set(defaultValues);
    } catch {
      return new Set(defaultValues);
    }
  };

  const [categoryFilter, setCategoryFilter] = useState(
    getInitialFilter("selectedCategories", uniqueCategories)
  );
  const [dynamicFilters, setDynamicFilters] = useState(() => {
    return Object.fromEntries(
      Object.keys(uniqueDynamicData).map((key) => [
        key,
        getInitialFilter(`selectedDynamic_${key}`, uniqueDynamicData[key]),
      ])
    );
  });

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify([...categoryFilter])
    );
    onFilterChange([...categoryFilter]);
  }, [categoryFilter, onFilterChange]);

  useEffect(() => {
    Object.entries(dynamicFilters).forEach(([key, values]) => {
      localStorage.setItem(
        `selectedDynamic_${key}`,
        JSON.stringify([...values])
      );
    });
    onDynamicFilterChange(dynamicFilters);
  }, [dynamicFilters, onDynamicFilterChange]);

  const handleCategoryChange = (category) => {
    setCategoryFilter((prev) => {
      const newFilter = new Set(prev);
      newFilter.has(category)
        ? newFilter.delete(category)
        : newFilter.add(category);
      return newFilter;
    });
  };

  const handleDynamicChange = (key, value) => {
    setDynamicFilters((prev) => ({
      ...prev,
      [key]: prev[key].has(value)
        ? new Set([...prev[key]].filter((v) => v !== value))
        : new Set([...prev[key], value]),
    }));
  };

  const selectAllCategories = () =>
    setCategoryFilter(new Set(uniqueCategories));

  const deselectAllCategories = () => setCategoryFilter(new Set());

  const selectAllDynamic = (key) => {
    setDynamicFilters((prev) => ({
      ...prev,
      [key]: new Set(uniqueDynamicData[key]),
    }));
  };

  const deselectAllDynamic = (key) => {
    setDynamicFilters((prev) => ({ ...prev, [key]: new Set() }));
  };

  const selectAll = () => {
    // Select all categories
    const allCategories = new Set(uniqueCategories);
    setCategoryFilter(allCategories);
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify([...allCategories])
    );

    // Select all dynamic filters
    const allDynamicFilters = Object.fromEntries(
      Object.keys(uniqueDynamicData).map((key) => [
        key,
        new Set(uniqueDynamicData[key]),
      ])
    );
    setDynamicFilters(allDynamicFilters);
    Object.entries(allDynamicFilters).forEach(([key, values]) =>
      localStorage.setItem(
        `selectedDynamic_${key}`,
        JSON.stringify([...values])
      )
    );
  };

  const deselectAll = () => {
    localStorage.removeItem("selectedCategories");

    // Deselect all categories
    setCategoryFilter(new Set());
    localStorage.setItem("selectedCategories", JSON.stringify([]));

    // Deselect all dynamic filters
    const clearedDynamicFilters = Object.fromEntries(
      Object.keys(uniqueDynamicData).map((key) => [key, new Set()])
    );
    setDynamicFilters(clearedDynamicFilters);
    Object.keys(uniqueDynamicData).forEach((key) =>
      localStorage.setItem(`selectedDynamic_${key}`, JSON.stringify([]))
    );
  };

  const resetAllFilters = () => {
    localStorage.removeItem("selectedCategories");
    Object.keys(uniqueDynamicData).forEach((key) =>
      localStorage.removeItem(`selectedDynamic_${key}`)
    );
    setCategoryFilter(new Set(uniqueCategories));
    setDynamicFilters(
      Object.fromEntries(
        Object.keys(uniqueDynamicData).map((key) => [
          key,
          new Set(uniqueDynamicData[key]),
        ])
      )
    );
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (
      filterContentRef.current &&
      !filterContentRef.current.contains(e.target)
    ) {
      setIsOpen(false); // Close the dropdown
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <button
        onClick={toggleDropdown}
        className="sticky w-full bg-white bottom-0 h-[66px]"
      >
        <div className="px-2 py-2 text-[14px] xl:text-lg font-medium text-center border-3 lg:py-5 lg:px-5 border-color5 text-color02 shadow-lg flex items-center gap-5 cursor-pointer hover:bg-color5 hover:text-white group transition-colors duration-200">
          <FilterIcon className="transition-colors duration-200 stroke-black fill-white group-hover:fill-white group-hover:stroke-white" />
        </div>
      </button>

      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-20 z-[100] p-3 bg-white border border-color5 bottom-0 w-max custom-shadow flex flex-col max-w-[500px] max-h-[600px] overflow-y-auto"
            ref={filterContentRef}
          >
            <div className="p-2">
              {/* Category Filters */}
              <div className="flex flex-col">
                <h4 className="mb-2 font-bold">Category</h4>
                <CheckboxGroup
                  value={[...categoryFilter]}
                  onValueChange={(val) => setCategoryFilter(new Set(val))}
                >
                  <div className="flex flex-wrap gap-4">
                    {uniqueCategories.map((category) => (
                      <Checkbox
                        key={category}
                        value={category}
                        className="text-sm"
                      >
                        {category}
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>
                <div className="flex gap-2 mt-2">
                  <Button
                    className="text-[10px] p-0"
                    radius="none"
                    size="sm"
                    variant="bordered"
                    onClick={selectAllCategories}
                  >
                    Select All
                  </Button>
                  <Button
                    className="text-[10px] p-0 px-1"
                    radius="none"
                    size="sm"
                    variant="bordered"
                    color="danger"
                    onClick={deselectAllCategories}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
            </div>

            {/* Dynamic Data Filters */}
            {Object.entries(uniqueDynamicData).map(([key, values]) => (
              <div key={key} className="flex flex-col">
                <h4 className="mb-2 font-bold">{key}</h4>
                <CheckboxGroup
                  value={[...(dynamicFilters[key] || [])]}
                  onValueChange={(val) =>
                    setDynamicFilters((prev) => ({
                      ...prev,
                      [key]: new Set(val),
                    }))
                  }
                >
                  <div className="flex flex-wrap gap-4">
                    {values.map((value) => (
                      <Checkbox key={value} value={value} className="text-sm">
                        {value}
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>
                <div className="flex gap-2 mt-2">
                  <Button
                    className="text-[10px] py-0"
                    radius="none"
                    size="sm"
                    variant="bordered"
                    onClick={() => selectAllDynamic(key)}
                  >
                    Select All
                  </Button>
                  <Button
                    className="text-[10px] py-0"
                    radius="none"
                    size="sm"
                    variant="bordered"
                    color="danger"
                    onClick={() => deselectAllDynamic(key)}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-5">
              <Button
                radius="none"
                color="danger"
                variant="flat"
                onClick={deselectAll}
              >
                Reset
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

export default FilterResources;
