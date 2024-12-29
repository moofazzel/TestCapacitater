export function parseDate(dateString) {
  if (!dateString || typeof dateString !== "string") {
    return new Date(); // Return current date or another default value
  }

  const [day, month, year] = dateString.split(" ");
  return new Date(`${month} ${day}, ${year}`);
}

export function filterDealsData(dealsData) {
  // const sixMonthsAgo = new Date();
  // sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const monthsBefore = 5;
  const today = new Date();
  const currentMonth = today.getMonth(); // 0 is January, 11 is December
  const currentYear = today.getFullYear();

  // Calculate the timeline start date
  const timelineStartDate = new Date(
    currentYear,
    currentMonth - monthsBefore,
    1
  );

  return dealsData.filter((deal) => {
    const startDate = parseDate(deal["Start Date"]);
    const endDate = parseDate(deal["End Date"]);
    const dealStage = deal["Deal Stage"];

    // Remove deals that are missing a start date or end date
    if (!deal["Start Date"] || !deal["End Date"]) {
      return false;
    }

    if (endDate < timelineStartDate) {
      return false;
    }

    // Remove deals with the "Closed Lost" stage
    if (dealStage === "Closed Lost") {
      return false;
    }

    // Keep the deal if all checks pass
    return true;
  });
}
// Process deals data to group by deal owner
export function processDealsAndResources(dealsData, resourcesData) {
  const filteredDealsData = filterDealsData(dealsData);

  const uniqueDealStages = [
    ...new Set(filteredDealsData.map((deal) => deal["Deal Stage"])),
  ];

  const groupedData = {};
  const resourcesForDeals = {};
  const resourcesGroupedByDealId = {}; // To group resources by their associated Deal IDs
  const today = new Date(); // Today's date for comparison

  // Group deals by deal owner
  filteredDealsData.forEach((row) => {
    const dealOwner = row["Deal Owner"];
    if (!dealOwner) return;

    if (!groupedData[dealOwner]) {
      groupedData[dealOwner] = {
        owner: dealOwner,
        deals: [],
      };
    }

    // Add the deal to the owner's group
    groupedData[dealOwner].deals.push(row);
  });

  const structuredDataByDealOwner = Object.values(groupedData);

  // Process resources and group by deal ID
  resourcesData.forEach((resourceRow) => {
    let totalUsedCapacity = 0;

    for (const key in resourceRow) {
      if (key.startsWith("Deal ID") && resourceRow[key]) {
        const dealId = resourceRow[key];

        if (!resourcesGroupedByDealId[dealId]) {
          resourcesGroupedByDealId[dealId] = [];
        }
        resourcesGroupedByDealId[dealId].push(resourceRow);

        // Initialize resource in resourcesForDeals if not already added
        const resourceName = resourceRow.Resources;
        if (resourceName) {
          if (!resourcesForDeals[resourceName]) {
            resourcesForDeals[resourceName] = {
              totalMaxCapacity:
                parseFloat(resourceRow["Total Max Capacity(%)"]) || 0,
              dealIds: new Set(),
              dealDetails: [],
              usedCapacity: 0,
              totalCurrentTaskCapacity: 0, // Initialize total current task capacity
            };
          }

          // Add deal ID and details to the resource's data
          resourcesForDeals[resourceName].dealIds.add(dealId);
          const dealDetail = filteredDealsData.find(
            (deal) => deal["Deal ID"] === dealId
          );
          if (dealDetail) {
            resourcesForDeals[resourceName].dealDetails.push(dealDetail);
          }

          // Calculate the used capacity for this resource
          const capacityKey = `Deal Capacity ${key.split(" ")[2]}(%)`;
          const capacityValue = parseFloat(resourceRow[capacityKey]);
          if (!isNaN(capacityValue)) {
            totalUsedCapacity += capacityValue;
          }
        }
      }
    }

    // Update used capacity for the resource
    const resourceName = resourceRow.Resources;
    if (resourceName && totalUsedCapacity > 0) {
      resourcesForDeals[resourceName].usedCapacity += totalUsedCapacity;
    }
  });

  // Calculate totalCurrentTaskCapacity for each resource
  for (const resourceName in resourcesForDeals) {
    const resource = resourcesForDeals[resourceName];

    resource.totalCurrentTaskCapacity = resource.dealDetails
      .filter((deal) => {
        const startDate = new Date(deal["Start Date"]);
        const endDate = new Date(deal["End Date"]);
        return startDate <= today && endDate >= today; // Check if today's date falls in the range
      })
      .reduce((total, deal) => {
        try {
          const dealId = deal["Deal ID"];

          // Find this resource's capacity for the current deal
          const resourceRow = resourcesGroupedByDealId[dealId]?.find(
            (res) => res.Resources === resourceName
          );

          if (resourceRow) {
            const dealIndex = Object.keys(resourceRow).find(
              (key) => key.includes(`Deal ID`) && resourceRow[key] === dealId
            );
            const capacityKey = `Deal Capacity ${dealIndex.split(" ")[2]}(%)`;
            const capacityValue = parseFloat(resourceRow[capacityKey] || 0);

            if (!isNaN(capacityValue)) {
              return total + capacityValue;
            }
          }

          return total;
        } catch (error) {
          console.error(
            `Error calculating capacity for resource: ${resourceName}, Deal ID: ${deal["Deal ID"]}. Error: ${error.message}`
          );
          return total; // Ignore this deal and continue
        }
      }, 0);
  }

  // Convert Set to array for dealIds
  for (const resourceName in resourcesForDeals) {
    resourcesForDeals[resourceName].dealIds = Array.from(
      resourcesForDeals[resourceName].dealIds
    );
  }

  // Add matched resources to each deal
  structuredDataByDealOwner.forEach((ownerData) => {
    ownerData.deals.forEach((deal) => {
      const dealId = deal["Deal ID"];
      deal.resources = resourcesGroupedByDealId[dealId] || [];
    });
  });

  return {
    structuredDataByDealOwner,
    resourcesForDeals,
    allResources: resourcesData,
    allDealStages: uniqueDealStages,
  };
}

// Parse date string to Date object
export function parseResourceDate(dateString) {
  if (dateString instanceof Date) {
    return dateString; // Return the Date object directly
  }

  if (typeof dateString !== "string") {
    return new Date(); // Return the current date as a fallback
  }

  const [day, month, year] = dateString.split(" ");

  // Ensure that month is parsed correctly
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();
  return new Date(parseInt(year, 10), monthIndex, parseInt(day, 10));
}

// Process resources data to match with deals and calculate remaining capacity and over capacity status for each resource and deal
export function processResourcesOnly(dealsData, resourcesData) {
  const filteredDealsData = filterDealsData(dealsData); // Filter deals first
  const allResources = {};

  resourcesData.forEach((resourceRow) => {
    const resourceName = resourceRow?.Resources;
    const category = resourceRow?.Category;
    const totalMaxCapacityValue = resourceRow["Total Max Capacity(%)"] || 0;
    const totalMaxCapacity = parseInt(totalMaxCapacityValue, 10);

    if (!resourceName) {
      return; // Skip if the resource name is not defined
    }

    // Initialize the resource object if it doesn't already exist
    if (!allResources[resourceName]) {
      allResources[resourceName] = {
        resourceName,
        category,
        totalMaxCapacity,
        remainingCapacity: totalMaxCapacity,
        dateHired: resourceRow["Date Hired"],
        overCapacity: false,
        exceededAmount: 0,
        deals: {}, // Object to store deals for the resource
        overtaskPeriods: [],
        availablePeriods: [],
        workingPeriods: [],
      };
    }

    let usedCapacity = 0;

    // Iterate over the resourceRow to find deals associated with this resource
    for (const key in resourceRow) {
      if (key.startsWith("Deal ID") && resourceRow[key]) {
        const dealIdKey = key;
        const dealId = resourceRow[dealIdKey];
        const dealCapacityKey =
          dealIdKey.replace("Deal ID", "Deal Capacity") + "(%)";
        const dealCapacity = parseInt(resourceRow[dealCapacityKey] || 0, 10);

        // Find the corresponding deal in the filtered deals data by dealId
        const dealData = filteredDealsData.find(
          (deal) => deal["Deal ID"] === dealId
        );

        // If no matching deal is found, continue
        if (!dealData) {
          console.warn(`No deal found for Deal ID: ${dealId}`);
          continue;
        }

        const startDateValue = dealData ? dealData["Start Date"] : undefined;
        const endDateValue = dealData ? dealData["End Date"] : undefined;

        // Add the deal data to the resource's deals object
        allResources[resourceName].deals[dealIdKey] = {
          dealId,
          client: dealData.Client, // Adding Client from dealsData
          project: dealData.Project, // Adding Project from dealsData
          dealStage: dealData["Deal Stage"], // Adding Deal Stage from dealsData
          dealCapacity,
          startDate: startDateValue,
          endDate: endDateValue,
        };

        usedCapacity += dealCapacity; // Sum up the used capacity
      }
    }

    const remainingCapacity = totalMaxCapacity - usedCapacity;
    allResources[resourceName].remainingCapacity = remainingCapacity;

    const hiredDate = parseResourceDate(allResources[resourceName].dateHired);
    const sortedDeals = Object.values(allResources[resourceName].deals).sort(
      (a, b) => parseResourceDate(a.startDate) - parseResourceDate(b.startDate)
    );

    let lastEndDate = hiredDate;
    let currentCapacity = 0;

    // Iterate over sorted deals to calculate working and available periods
    sortedDeals.forEach((deal) => {
      const startDate = parseResourceDate(deal.startDate);
      const endDate = parseResourceDate(deal.endDate);
      const dealCapacity = deal.dealCapacity;

      // If there's a gap between deals, mark it as an available period
      if (startDate > lastEndDate) {
        allResources[resourceName].availablePeriods.push({
          availableStartDate: lastEndDate,
          availableEndDate: startDate,
          remainingCapacity: totalMaxCapacity, // Full capacity available
        });
      }

      // Mark the working period for this deal
      allResources[resourceName].workingPeriods.push({
        workingStartDate: startDate,
        workingEndDate: endDate,
      });

      currentCapacity += dealCapacity;
      const remainingCapacityDuringDeal = totalMaxCapacity - currentCapacity;

      // If the capacity during the deal is less than full, mark it as a partial available period
      if (remainingCapacityDuringDeal > 0) {
        allResources[resourceName].availablePeriods.push({
          availableStartDate: startDate,
          availableEndDate: endDate,
          partial: true,
          remainingCapacity: remainingCapacityDuringDeal,
        });
      }

      lastEndDate = endDate; // Update the last end date to the current deal's end date
    });

    // Mark any remaining available periods after the last deal until the end of the year
    const timelineEndDate = new Date(new Date().getFullYear(), 11, 31); // End of December
    if (lastEndDate < timelineEndDate) {
      allResources[resourceName].availablePeriods.push({
        availableStartDate: lastEndDate,
        availableEndDate: timelineEndDate,
        remainingCapacity: totalMaxCapacity, // Full capacity available
      });
    }

    // Calculate overtask periods for the resource
    for (let i = 0; i < sortedDeals.length; i++) {
      const currentDeal = sortedDeals[i];
      const currentStartDate = parseResourceDate(currentDeal.startDate);
      let currentEndDate = parseResourceDate(currentDeal.endDate);
      const activeDeals = [
        {
          startDate: currentStartDate,
          endDate: currentEndDate,
          capacity: currentDeal.dealCapacity,
        },
      ];

      for (let j = i + 1; j < sortedDeals.length; j++) {
        const nextDeal = sortedDeals[j];
        const nextStartDate = parseResourceDate(nextDeal.startDate);
        const nextEndDate = parseResourceDate(nextDeal.endDate);

        if (nextStartDate <= currentEndDate) {
          activeDeals.push({
            startDate: nextStartDate,
            endDate: nextEndDate,
            capacity: nextDeal.dealCapacity,
          });

          currentEndDate = new Date(
            Math.max(currentEndDate.getTime(), nextEndDate.getTime())
          );

          const totalCapacity = activeDeals.reduce(
            (sum, deal) => sum + deal.capacity,
            0
          );

          if (totalCapacity > totalMaxCapacity) {
            allResources[resourceName].overtaskPeriods.push({
              overtaskStartDate: currentStartDate,
              overtaskEndDate: currentEndDate,
              overtaskedCapacity: totalCapacity - totalMaxCapacity,
            });
          }
        } else {
          break;
        }
      }
    }
  });

  return {
    resourcesData: allResources,
    totalResourcesLength: Object.keys(allResources).length,
  };
}