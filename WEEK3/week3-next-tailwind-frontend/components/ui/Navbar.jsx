"use-client"
import { FaBars } from "react-icons/fa";
import Search from "./Search";
import UserMenu from "./User-menu";

export default function Navbar({onToggleSidebar}) {
  return (
    <header className="bg-[#343A40] text-gray-300 flex items-center justify-between px-4 py-3 shadow-md">

      {/* <button className="text-gray-300 hover:text-white">
        <FaBars size={18} />
      </button> */}

      <button onClick={onToggleSidebar} className="text-gray-300 hover:text-white">
        <FaBars size={18} />
      </button>


      <div className="flex items-center gap-6">
        <Search />
        <UserMenu />
      </div>

    </header>
  );
}
