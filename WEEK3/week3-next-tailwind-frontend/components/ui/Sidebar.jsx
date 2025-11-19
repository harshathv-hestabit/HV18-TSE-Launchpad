import { FaTachometerAlt, FaBookOpen, FaChartArea, FaTable, FaAngleRight } from 'react-icons/fa';
import { FaTableColumns } from 'react-icons/fa6';

export default function Sidebar() {
  return (
    <aside className="flex flex-col gap-4 bg-[#343A40] w-64 h-full fixed py-4">

      <div className="ml-4 text-2xl font-bold">Start Bootstrap</div>

      <div className="flex flex-col py-4 gap-4 h-full bg-gray-800">
        <div className="ml-4 mr-4 flex flex-col gap-4 py-4">
          <p className='font-bold text-sm text-gray-600'>CORE</p>
          <div>
            <ul className='flex flex-col gap-6 py-4'>
              <li>
                <div className='flex items-center gap-2'>
                  <FaTachometerAlt />
                  <p>Dashboard</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="ml-4 mr-4 flex flex-col gap-4 py-4">
          <p className='font-bold text-sm text-gray-600'>INTERFACE</p>
          <div>
            <ul className='flex flex-col gap-6 py-4'>
              <li className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <FaTableColumns />
                  <p>Layouts</p>
                </div>
                <FaAngleRight />
              </li>
              <li className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <FaBookOpen />
                  <p>Pages</p>
                </div>
                <FaAngleRight />
              </li>
            </ul>
          </div>
        </div>

        <div className="ml-4 mr-4 flex flex-col gap-4 py-4">
          <p className='font-bold text-sm text-gray-600'>ADDONS</p>
          <div className="">
            <ul className='flex flex-col gap-6 py-4'>
              <li>
                <div className='flex items-center gap-2'>
                  <FaChartArea />
                  <p>Charts</p>
                </div>
              </li>
              <li>
                <div className='flex items-center gap-2'>
                  <FaTable />
                  <p>Tables</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </aside>
  );
}
