function formatDate(date: Date): string {
    return date.toLocaleString("en-UK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "narrow"
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
    return (
        date.getHours() > start.getHours() && date.getHours() < end.getHours()
    );
}

function formatDateForJavaLocalDateTime(date?: Date): string | undefined {
    if (!date) return;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = date.getMilliseconds();
    return (
        year +
        "-" +
        month +
        "-" +
        day +
        "T" +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        "." +
        milliseconds.toString().padStart(6, "0")
    );
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

export {
    formatDate,
    isSameDay,
    formatDateForJavaLocalDateTime,
    isBetween,
    getDateArray,
    formatHour,
    formatDateDayAndMonth,
    formatDateWithoutYear
};
