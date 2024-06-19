import { Link } from "react-router-dom";
import { ReactNode, useState } from "react";

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
                className={`${selected ? "cursor-default" : "cursor-pointer hover:text-slate-500"} font-semibold bg-gray-light p-4 w-56 transition-colors"`}
            >
                {children}
            </button>
        </Link>
    );
}

function NavBar() {
    const [selected, setSelected] = useState<string>(window.location.pathname);
    return (
        <nav className="p-2 bg-slate-900 text-slate-300">
            <NavButton
                to="/"
                onClick={() => setSelected("/")}
                selected={selected === "/"}
            >
                Home
            </NavButton>
        </nav>
    );
}

export default NavBar;
