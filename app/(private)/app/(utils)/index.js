export function formatDate(dateString) {
  // Create a new Date object from the input date string
  const date = new Date(dateString);

  // Format the date to "6 Oct 2024" using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  return formattedDate;
}

export const parseResourceDate = (dateString) => {
  if (!dateString) return new Date();
  const [day, month, year] = dateString.split(" ");
  return new Date(`${month} ${day}, ${year}`);
};

export function getMondays(year, month) {
  const mondays = [];
  const date = new Date(year, month, 1);

  // Adjust the date to the first Monday of the month
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  // Get all Mondays in the month
  while (date.getMonth() === month) {
    mondays.push(new Date(date.getTime()));
    date.setDate(date.getDate() + 7);
  }

  return mondays;
}

export function getMonthsRange(
  currentMonth,
  currentYear,
  monthsBefore,
  monthsAfter
) {
  const startMonth = currentMonth - monthsBefore;
  const endMonth = currentMonth + monthsAfter;
  const months = [];

  for (let i = startMonth; i <= endMonth; i++) {
    const date = new Date(currentYear, i);
    months.push({
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  return months;
}

export function parseDate(dateString) {
  if (!dateString || typeof dateString !== "string") {
    return new Date(); // Return current date or another default value
  }

  const [day, month, year] = dateString.split(" ");
  return new Date(`${month} ${day}, ${year}`);
}

export const colors = {
  closedWon: {
    bgColor: "#F08B17",
    stroke: "#FFE89C",
  },
  registration: {
    bgColor: "#81F0D6",
    stroke: "#51AA95",
  },
  negotiation: {
    bgColor: "#A6CFFF",
    stroke: "#6099DA",
  },
  pitched: {
    bgColor: "#CDA9FF",
    stroke: "#9465D6",
  },
  qualified: {
    bgColor: "#E9D0AD",
    stroke: "#C29555",
  },
  allOthers: {
    bgColor: "#D8D7DC",
    stroke: "#3F3E40",
  },
};

export const getColor = (dealStage, border = false) => {
  let colorSet;

  switch (dealStage) {
    case "Closed Won":
      colorSet = colors.closedWon;
      break;
    case "Registration":
      colorSet = colors.registration;
      break;
    case "Negotiation":
    case "Pitched":
      colorSet = colors.negotiation;
      break;
    case "Pitching":
    case "Qualified":
      colorSet = colors.qualified;
      break;
    default:
      colorSet = colors.allOthers;
  }

  // Return bgColor or stroke based on the `border` flag
  return border ? colorSet.stroke : colorSet.bgColor;
};

// Parse date string to Date object
