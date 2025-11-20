import { FaUser, FaCaretDown } from "react-icons/fa";

export default function UserMenu() {
  return (
    <button className="flex items-center gap-2 py-2 text-gray-300 hover:text-white">
      <FaUser />
      <FaCaretDown />
    </button>
  );
}