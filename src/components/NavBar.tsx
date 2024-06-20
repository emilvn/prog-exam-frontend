import { Link } from "react-router-dom";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

function NavButton({
  to,
  children,
  onClick,
  selected
}: {
  to: string;
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
    >
      <button
        className={`${selected ? "bg-sky-800" : "bg-sky-500 hover:bg-sky-800"} font-semibold px-4 py-3 transition-colors cursor-pointer"`}
      >
        {children}
      </button>
    </Link>
  );
}

interface ParticipantSearchProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

function ParticipantSearch({ setSearch, search }: ParticipantSearchProps) {
  const [searchString, setSearchString] = useState<string>(search);

  useEffect(() => {
    if (searchString === "") {
      setSearch(searchString);
    }
  }, [searchString]);

  return (
    <input
      type="search"
      value={searchString}
      onChange={(e) => setSearchString(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setSearch(searchString);
        }
      }}
      className="border rounded p-2 text-black mx-8"
      placeholder="Søg efter deltager..."
    />
  );
}

interface NavBarProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

function NavBar({ search, setSearch }: NavBarProps) {
  const [selected, setSelected] = useState<string>(window.location.pathname);
  return (
    <nav className="p-2 bg-sky-500 text-sky-50 flex items-center">
      <ParticipantSearch
        search={search}
        setSearch={setSearch}
      />
      <NavButton
        to="/"
        onClick={() => setSelected("/")}
        selected={selected === "/"}
      >
        Hjem
      </NavButton>
      <NavButton
        to="/participants"
        onClick={() => setSelected("/participants")}
        selected={selected === "/participants"}
      >
        Deltagere
      </NavButton>
      <NavButton
        to="/disciplines"
        onClick={() => setSelected("/disciplines")}
        selected={selected === "/disciplines"}
      >
        Discipliner
      </NavButton>
      <NavButton
        to={"/results"}
        onClick={() => setSelected("/results")}
        selected={selected === "/results"}
      >
        Resultater
      </NavButton>
    </nav>
  );
}

export default NavBar;
