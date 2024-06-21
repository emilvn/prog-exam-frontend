import { useEffect, useState } from "react";

interface DistanceInputProps {
  value: number;
  onValueChange: (result: number) => void;
}

function DistanceInput({ value, onValueChange }: DistanceInputProps) {
  const [centimetres, setCentimetres] = useState<number>(0);
  const [metres, setMetres] = useState<number>(0);

  useEffect(() => {
    setCentimetres(value % 100);
    setMetres(Math.floor(value / 100));
  }, []);

  useEffect(() => {
    onValueChange(metres * 100 + centimetres);
  }, [metres, centimetres]);

  return (
    <div className={"flex gap-1"}>
      <input
        type="number"
        value={metres}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setMetres(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setMetres(0);
            return;
          }
          setMetres(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>m</span>
      <input
        type="number"
        value={centimetres}
        onChange={(e) => {
          if (isNaN(Number(e.target.value))) {
            setCentimetres(0);
            return;
          }
          if (Number(e.target.value) < 0) {
            setCentimetres(0);
            return;
          }
          setCentimetres(Number(e.target.value));
        }}
        className={"border rounded w-10 text-center"}
      />
      <span>cm</span>
    </div>
  );
}

export default DistanceInput;
