import { FaBars,FaSearch, FaCaretDown, FaUser } from 'react-icons/fa';

export default function Navbar() {
  return (
    <header className="bg-[#343A40] text-gray-300 3 flex justify-between items-center shadow-md">
      <div className='ml-2 mr-3'>
        <FaBars/>
      </div>
      <div className=" p-3 flex gap-8">
        <div className='w-full flex items-center'>
          <input
            type="text"
            placeholder="Search for..."
            className=" w-full h-full px-2 py-2 text-black bg-white rounded-l-md placeholder-gray-400"
          />
          <button className="flex-1 w-full h-full px-2 py-3 items-center rounded-r-md bg-blue-500">
            <FaSearch/>
          </button>
        </div>
        <div>
          <button className="flex items-center content-center py-3">
            <FaUser/>
            <FaCaretDown/>
          </button>
        </div>
      </div>
    </header>
  );
}
