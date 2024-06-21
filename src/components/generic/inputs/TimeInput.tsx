import { useEffect, useState } from "react";

interface TimeInputProps {
  value: number;
  onValueChange: (result: number) => void;
}

function TimeResultInput({ value, onValueChange }: TimeInputProps) {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [milliseconds, setMilliseconds] = useState<number>(0);

  useEffect(() => {
    setHours(Math.floor(value / 3600000));
    setMinutes(Math.floor((value % 3600000) / 60000));
    setSeconds(Math.floor((value % 60000) / 1000));
    setMilliseconds(value % 1000);
  }, []);

  useEffect(() => {
    onValueChange(hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds);
  }, [hours, minutes, seconds, milliseconds]);

  return (
    <div className={"flex gap-2 w-56"}>
      <input
        type="number"
        value={hours}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setHours(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setHours(0);
            return;
          }
          setHours(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>:</span>
      <input
        type="number"
        value={minutes}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setMinutes(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setMinutes(0);
            return;
          }
          setMinutes(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>:</span>
      <input
        type="number"
        value={seconds}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setSeconds(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setSeconds(0);
            return;
          }
          setSeconds(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>,</span>
      <input
        type="number"
        value={milliseconds}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setMilliseconds(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setMilliseconds(0);
            return;
          }
          setMilliseconds(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
    </div>
  );
}

export default TimeResultInput;
