import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export function formatCustomDate(createdAt) {
  const now = new Date();
  const createdDate = new Date(createdAt);

  const seconds = differenceInSeconds(now, createdDate);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = differenceInMinutes(now, createdDate);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = differenceInHours(now, createdDate);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;

  const days = differenceInDays(now, createdDate);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = differenceInMonths(now, createdDate);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = differenceInYears(now, createdDate);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
