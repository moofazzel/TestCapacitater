import { parseDate } from ".";

export function calculateDealsRow(deals, currentDeal) {
  const currentStartDate = parseDate(currentDeal["Start Date"]);
  const currentEndDate = parseDate(currentDeal["End Date"]);

  let row = 0;

  while (true) {
    let isOverlap = false;

    for (let deal of deals) {
      if (deal.row !== row) continue;

      const startDate = parseDate(deal["Start Date"]);
      const endDate = parseDate(deal["End Date"]);

      if (
        (currentStartDate >= startDate && currentStartDate <= endDate) ||
        (currentEndDate >= startDate && currentEndDate <= endDate) ||
        (currentStartDate <= startDate && currentEndDate >= endDate)
      ) {
        isOverlap = true;
        row++;
        break;
      }
    }

    if (!isOverlap) break;
  }

  return row;
}
