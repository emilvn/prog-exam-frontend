import { MdClose, MdKeyboardArrowDown } from "react-icons/md";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface MultiSelectProps {
  options: { value: number; label: string }[];
  selectedIds: number[];
  setSelectedIds: Dispatch<SetStateAction<number[]>>;
  placeholder?: string;
}

function MultiSelect({ options, selectedIds, setSelectedIds, placeholder }: MultiSelectProps) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] =
    useState<{ value: number; label: string }[]>(options);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setFilteredOptions(options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())));
  }, [search, options]);

  return (
    <div className={"w-80 relative border rounded-lg py-2"}>
      <div className={"px-4 flex items-center justify-between"}>
        <input
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={"focus:ring-transparent outline-none"}
          onClick={() => setShowOptions(true)}
        />
        <div
          className={"cursor-pointer h-6 w-6 flex justify-center items-center"}
          onClick={() => setShowOptions(!showOptions)}
        >
          <MdKeyboardArrowDown />
        </div>
      </div>
      {showOptions && (
        <div
          className={
            "flex flex-col absolute bg-white border rounded-b z-50 w-full max-h-48 overflow-y-auto"
          }
        >
          {filteredOptions.length > 0 &&
            filteredOptions.map((o) => {
              const isOptionSelected = selectedIds.includes(o.value);
              return (
                <button
                  key={o.value}
                  className={
                    "border-b px-4 py-2 hover:bg-sky-300 flex justify-between font-semibold" +
                    (isOptionSelected ? " bg-sky-500 text-white" : "")
                  }
                  onClick={() => {
                    if (isOptionSelected) {
                      setSelectedIds((prev) => prev.filter((id) => id !== o.value));
                    } else {
                      setSelectedIds((prev) => [...prev, o.value]);
                    }
                  }}
                  type={"button"}
                >
                  {o.label}
                  {isOptionSelected && <MdClose className={"inline-block"} />}
                </button>
              );
            })}
          {filteredOptions.length === 0 && (
            <div className={"px-4 py-2 italic text-gray-500"}>Intet at se her</div>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
