import { FaSearch } from "react-icons/fa";

export default function Search() {
  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search for..."
        className="px-3 py-2 bg-white rounded-l-md focus:outline-none text-black"
      />
      <button className="px-3 py-3 bg-blue-600 text-white rounded-r-md">
        <FaSearch />
      </button>
    </div>
  );
}
