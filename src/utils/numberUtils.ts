function formatMilliseconds(timeInMs: number): string {
  const hours = Math.floor(timeInMs / 3600000);
  const minutes = Math.floor((timeInMs % 3600000) / 60000);
  const seconds = Math.floor((timeInMs % 60000) / 1000);
  const milliseconds = timeInMs % 1000;

  if (hours === 0 && minutes === 0) {
    return `${seconds.toString().padStart(2, "0")},${milliseconds.toString().substring(0, 2)}s`;
  }
  if (hours === 0) {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${milliseconds.toString().substring(0, 2)}`;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${milliseconds.toString().substring(0, 2)}`;
}

function formatCentimeters(centimeters: number): string {
  const meters = Math.floor(centimeters / 100);
  const centimetersLeft = centimeters % 100;

  return `${meters},${centimetersLeft} meter`;
}

export { formatMilliseconds, formatCentimeters };
