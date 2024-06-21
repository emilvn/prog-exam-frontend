import { ChangeEvent, HTMLInputTypeAttribute } from "react";

interface FormInputProps {
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: HTMLInputTypeAttribute | undefined;
  value: string | number | readonly string[] | undefined;
}
function FormInput({ label, onChange, type, value }: FormInputProps) {
  return (
    <label className={"flex flex-col"}>
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={"border p-2 rounded"}
      />
    </label>
  );
}

export default FormInput;
