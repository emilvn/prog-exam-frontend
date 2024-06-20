function formatDate(date: Date): string {
  return date.toLocaleString("en-UK", {
    month: "2-digit",
    day: "2-digit"
  });
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

function isBetween(date: Date, start: Date, end: Date): boolean {
  return date.getHours() > start.getHours() && date.getHours() < end.getHours();
}

function getDateArray(fromDate: Date, toDate: Date): Date[] {
  const dates = [];

  for (let i = new Date(fromDate); i <= toDate; i.setDate(i.getDate() + 1)) {
    dates.push(new Date(i));
  }
  return dates;
}

function formatHour(date: Date): string {
  return date.toLocaleString("en-UK", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDateDayAndMonth(date: Date): string {
  return date.toLocaleString("en-UK", {
    day: "2-digit",
    month: "2-digit"
  });
}

function formatDateWithoutYear(date: Date): string {
  return date.toLocaleString("en-UK", {
    month: "2-digit",
    day: "2-digit",
    weekday: "narrow"
  });
}

function getAge(date: Date): number {
  const ageDifMs = Date.now() - date.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export {
  formatDate,
  isSameDay,
  isBetween,
  getDateArray,
  formatHour,
  formatDateDayAndMonth,
  formatDateWithoutYear,
  getAge
};
