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
const DynamicEditResourceModal = dynamic(() => import("./EditResourcesModal"), {
  ssr: false,
});
const DynamicDeleteResourceModal = dynamic(
  () => import("./DeleteResourceModal"),
  {
    ssr: false,
  }
);

// Define the columns
const columns = [
  { name: "Name", uid: "resource", sortable: true },
  { name: "Category", uid: "category", sortable: true },
  { name: "Total Max Capacity(%)", uid: "totalMaxCapacity", sortable: true },
  { name: "Date Hired", uid: "dateHired", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "resource",
  "category",
  "actions",
  "totalMaxCapacity",
  "dateHired",
];

export default function ResourcesTable({ resourcesData }) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "category",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState(new Set());

  const rowsPerPage = resourcesData?.length;

  const hasSearchFilter = Boolean(filterValue);

  // Extract unique categories from resourcesData dynamically
  const categoryOptions = useMemo(() => {
    const categories = resourcesData.map((resource) => resource.category);
    return [...new Set(categories)].map((category) => ({
      name: category,
      uid: category,
    }));
  }, [resourcesData]);

  // Set initial category filter to include all categories
  useEffect(() => {
    if (categoryOptions.length > 0) {
      setCategoryFilter(
        new Set(categoryOptions.map((category) => category.uid))
      );
    }
  }, [categoryOptions]);

  // Filtered Columns based on visibility selection
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // Filter resources based on search and selected categories
  const filteredItems = useMemo(() => {
    let filteredResources = [...resourcesData];

    if (hasSearchFilter) {
      filteredResources = filteredResources.filter((resource) =>
        resource.resource.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      Array.from(categoryFilter).length > 0 &&
      Array.from(categoryFilter).length !== categoryOptions.length
    ) {
      filteredResources = filteredResources.filter((resource) =>
        Array.from(categoryFilter).includes(resource.category)
      );
    }

    return filteredResources;
  }, [resourcesData, filterValue, categoryFilter, categoryOptions]);

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

  const renderCell = useCallback((resource, columnKey) => {
    const cellValue = resource[columnKey];

    switch (columnKey) {
      case "resource":
        return (
          <div
            className="py-5 text-lg text-center capitalize text-color02"
            size="sm"
            variant="flat"
          >
            {cellValue}
          </div>
        );
      case "category":
        return (
          <div
            className="text-lg text-center capitalize text-color02"
            size="sm"
            variant="flat"
          >
            {cellValue || "N/A"}
          </div>
        );
      case "totalMaxCapacity":
        return (
          <div
            className="text-lg text-center capitalize text-color02"
            size="sm"
            variant="flat"
          >
            {cellValue || "N/A"}
          </div>
        );
      case "dateHired":
        return (
          <div
            className="text-lg text-center capitalize text-color02"
            size="sm"
            variant="flat"
          >
            {cellValue || "N/A"}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-3">
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
        return cellValue;
    }
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 px-0">
        <div className="items-end justify-between gap-3 md:flex">
          <div className="relative md:w-[450px]   mb-5 md:mb-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-color03">
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
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-color03"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {/* Category Filter Dropdown */}
            <Dropdown>
              <DropdownTrigger className="flex items-center justify-center gap-2">
                <button className="px-3 py-2 md:px-6 md:py-4 border text-color03 border-color5 shadow-dark-gray text-[12px] md:text-[15px]">
                  Category
                  <ChevronDownIcon className="inline w-2 h-2 ml-2 text-small md:w-full md:h-full" />
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

            {/* Column Visibility Dropdown */}
            <Dropdown>
              <DropdownTrigger className="flex items-center justify-center gap-2">
                <button className="px-3 py-2 md:px-6 md:py-4 border text-color03 border-color5 shadow-dark-gray text-[12px] md:text-[15px]">
                  Columns
                  <ChevronDownIcon className="inline w-2 h-2 ml-2 text-small md:w-full md:h-full" />
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
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <DynamicAddResourceModal />
          </div>
        </div>
        <div className="flex items-center justify-start mb-2 mt-7">
          <span className="text-color03 text-[15px]">
            Total {resourcesData?.length} resources
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    categoryFilter,
    visibleColumns,
    resourcesData?.length,
    onSearchChange,
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
