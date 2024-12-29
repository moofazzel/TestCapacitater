function generateRandomDate(start, end) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();

  // Generate a random timestamp between the start and end range
  const randomTimestamp =
    Math.floor(Math.random() * (endDate - startDate + 1)) + startDate;

  // Convert the timestamp back to a date
  const randomDate = new Date(randomTimestamp);

  // Return the full date string (e.g., "Sat Dec 14 2024 06:00:00 GMT+0600 (Bangladesh Standard Time)")
  return randomDate.toString();
}

// Test the function
function testGenerateRandomDates() {
  const startTimeline = new Date();
  startTimeline.setMonth(startTimeline.getMonth() - 6); // 6 months before today

  const endTimeline = new Date();
  endTimeline.setMonth(endTimeline.getMonth() + 4); // 4 months after today

  // Generate random dates within the range
  const randomDate1 = generateRandomDate(startTimeline, endTimeline);
  const randomDate2 = generateRandomDate(startTimeline, endTimeline);
  const randomDate3 = generateRandomDate(startTimeline, endTimeline);
}

testGenerateRandomDates();

module.exports = { generateRandomDate };
