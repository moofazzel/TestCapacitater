"use client";

import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { capitalize } from "../_utils/utils";

const DynamicAddResourceModal = dynamic(() => import("./AddResourcesModal"), {
  ssr: false,
});
const DynamicAddNewDataFieldToSheet = dynamic(
  () => import("./AddNewDataFieldToSheet"),
  { ssr: false }
);
const DynamicEditResourceModal = dynamic(() => import("./EditResourcesModal"), {
  ssr: false,
});
const DynamicDeleteResourceModal = dynamic(
  () => import("./DeleteResourceModal"),
  { ssr: false }
);

export default function ResourcesTable({ resourcesData }) {
  // Compute dynamic columns from the resource data.
  // Any keys that are not among these fixed keys will be treated as dynamic.
  const dynamicColumns = useMemo(() => {
    if (!resourcesData || resourcesData.length === 0) return [];
    const dataKeys = Object.keys(resourcesData[0]);
    const fixedKeys = [
      "id",
      "resource",
      "category",
      "totalMaxCapacity",
      "dateHired",
    ];
    return dataKeys
      .filter((key) => !fixedKeys.includes(key))
      .map((key) => ({
        name: key,
        uid: key,
        sortable: false,
      }));
  }, [resourcesData]);

  // Combine fixed and dynamic columns in the desired order:
  // Name, Category, (dynamic columns), Total Max Capacity, Date Hired, ACTIONS.
  const finalColumns = useMemo(() => {
    return [
      { name: "Name", uid: "resource", sortable: true },
      { name: "Category", uid: "category", sortable: true },
      ...dynamicColumns, // dynamic fields appear here
      {
        name: "Total Max Capacity(%)",
        uid: "totalMaxCapacity",
        sortable: true,
      },
      { name: "Date Hired", uid: "dateHired", sortable: true },
      { name: "ACTIONS", uid: "actions" },
    ];
  }, [dynamicColumns]);

  // Initialize visibleColumns to include all keys from finalColumns.
  const initialVisibleColumns = useMemo(
    () => new Set(finalColumns.map((col) => col.uid)),
    [finalColumns]
  );

  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);

  // Other state variables
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "category",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState(new Set());

  const rowsPerPage = resourcesData?.length || 0;
  const hasSearchFilter = Boolean(filterValue);

  // Compute category options from resource data
  const categoryOptions = useMemo(() => {
    const categories = resourcesData.map((resource) => resource.category);
    return [...new Set(categories)].map((category) => ({
      name: category,
      uid: category,
    }));
  }, [resourcesData]);

  // Set initial category filter to include all categories
  // Update visibleColumns automatically whenever finalColumns changes
  useEffect(() => {
    setVisibleColumns(new Set(finalColumns.map((col) => col.uid)));
  }, [finalColumns]);

  // Compute headerColumns based on visibleColumns.
  // If visibleColumns is empty (should not happen with the initialization above), fallback to finalColumns.
  const headerColumns = useMemo(() => {
    if (visibleColumns.size === 0) return finalColumns;
    return finalColumns.filter((col) => visibleColumns.has(col.uid));
  }, [visibleColumns, finalColumns]);

  // Filter resources based on search input and category filter
  const filteredItems = useMemo(() => {
    let filtered = [...resourcesData];
    if (hasSearchFilter) {
      filtered = filtered.filter((resource) =>
        resource.resource.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      categoryFilter.size > 0 &&
      categoryFilter.size !== categoryOptions.length
    ) {
      filtered = filtered.filter((resource) =>
        categoryFilter.has(resource.category)
      );
    }
    return filtered;
  }, [
    resourcesData,
    filterValue,
    categoryFilter,
    categoryOptions,
    hasSearchFilter,
  ]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Render the content for each cell based on the column key.
  const renderCell = useCallback((resource, columnKey) => {
    const cellValue = resource[columnKey];
    switch (columnKey) {
      case "resource":
        return (
          <div className="py-5 text-lg text-center capitalize text-color02">
            {cellValue}
          </div>
        );
      case "category":
        return (
          <div className="text-lg text-center capitalize text-color02">
            {cellValue || "N/A"}
          </div>
        );
      case "totalMaxCapacity":
        return (
          <div className="text-lg text-center capitalize text-color02">
            {cellValue || "N/A"}
          </div>
        );
      case "dateHired":
        return (
          <div className="text-lg text-center capitalize text-color02">
            {!cellValue || cellValue.includes("NaN") ? "N/A" : cellValue}
          </div>
        );
      case "actions":
        return (
          <div className="flex relative gap-3 justify-center items-center">
            <Tooltip content="Edit user">
              <span className="text-lg cursor-pointer text-default-400 active:opacity-50">
                <DynamicEditResourceModal resourceData={resource} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg cursor-pointer text-danger active:opacity-50">
                <DynamicDeleteResourceModal resourceName={resource.resource} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return (
          <div className="text-lg text-center capitalize text-color02">
            {cellValue || "N/A"}
          </div>
        );
    }
  }, []);

  const onSearchChange = useCallback((value) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <>
        <div className="gap-3 justify-between lg:flex">
          <div className="relative w-full lg:w-[350px] mb-5 lg:mb-0">
            <span className="flex absolute inset-y-0 left-0 items-center pl-5 text-color03">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search by name..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-[15px] py-4 pl-12 pr-4 border-2 text-color03 border-color5 focus:outline-none focus:ring-2 focus:ring-color5 shadow-dark-gray"
            />
            {filterValue && (
              <button
                onClick={onClear}
                className="flex absolute inset-y-0 right-0 items-center pr-3 text-color03"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3 md:flex-nowrap">
            {/* Category Filter Dropdown */}
            <div>
              <Dropdown>
                <DropdownTrigger className="flex gap-2 justify-center items-center">
                  <button className="px-3 py-2.5 md:px-6 md:py-4 border text-color03 border-color5 shadow-dark-gray text-[12px] md:text-[15px]">
                    Category
                    <ChevronDownIcon className="inline ml-2 w-2 h-2 text-small md:w-full md:h-full" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Filter by Category"
                  closeOnSelect={false}
                  selectedKeys={categoryFilter}
                  selectionMode="multiple"
                  onSelectionChange={setCategoryFilter}
                >
                  {categoryOptions.map((category) => (
                    <DropdownItem key={category.uid} className="capitalize">
                      {capitalize(category.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            {/* Column Visibility Dropdown */}
            <div>
              <Dropdown>
                <DropdownTrigger className="flex gap-2 justify-center items-center">
                  <button className="px-3 py-2.5 md:px-6 md:py-4 border text-color03 border-color5 shadow-dark-gray text-[12px] md:text-[15px]">
                    Columns
                    <ChevronDownIcon className="inline ml-2 w-2 h-2 text-small md:w-full md:h-full" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                >
                  {finalColumns.map((column) => (
                    <DropdownItem key={column.uid} className="capitalize">
                      {capitalize(column.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <DynamicAddNewDataFieldToSheet />
            <DynamicAddResourceModal resourcesData={resourcesData} />
          </div>
        </div>
        <div className="flex justify-start items-center mt-7 mb-2">
          <span className="text-color03 text-[15px]">
            Total {resourcesData?.length} resources
          </span>
        </div>
      </>
    );
  }, [
    filterValue,
    categoryFilter,
    visibleColumns,
    resourcesData?.length,
    onSearchChange,
    categoryOptions,
    onClear,
    finalColumns,
  ]);

  return (
    <Table
      aria-label="Resources table with custom cells, pagination and sorting"
      isHeaderSticky
      classNames={{
        wrapper: "h-full max-h-[75vh] p-0 custom-round mb-20",
      }}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            className="table-header"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No resources found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id} className="table-row">
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
