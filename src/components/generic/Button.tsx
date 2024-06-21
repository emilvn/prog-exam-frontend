interface ButtonProps {
  onClick?: () => void;
  text: string;
  color?: string;
  type?: "button" | "submit" | "reset";
}

const colors: { [key: string]: string } = {
  blue: "bg-blue-500 hover:bg-blue-800 text-white ",
  green: "bg-green-500 hover:bg-green-800 text-white ",
  red: "bg-red-500 hover:bg-red-800 text-white ",
  gray: "bg-gray-400 hover:bg-gray-800 text-white ",
  none: "border hover:bg-gray-200 text-black"
};

function Button({ onClick, text, color, type }: ButtonProps) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      className={`${color ? colors[color] : colors["none"]} px-4 py-2 rounded-lg cursor-pointer transition-colors font-semibold`}
    >
      {text}
    </button>
  );
}

export default Button;
