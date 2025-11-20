import { FaTachometerAlt, FaBookOpen, FaChartArea, FaTable, FaAngleRight } from "react-icons/fa";
import { FaTableColumns } from "react-icons/fa6";

import SidebarGroup from "./Sidebar-group";
import SidebarGroupItem from "./Sidebar-group-items";

export default function Sidebar() {
  return (
    <aside className="flex flex-col bg-[#343A40] w-64 h-full fixed py-6">

      <div className="px-6 text-white text-2xl font-semibold justify-center mb-3">
        Start Bootstrap
      </div>

      <div className="flex flex-col gap-6 bg-gray-800 h-full py-4">
        <SidebarGroup label="CORE">
          <SidebarGroupItem icon={<FaTachometerAlt />} label="Dashboard" />
        </SidebarGroup>

        <SidebarGroup label="INTERFACE">
          <SidebarGroupItem
            icon={<FaTableColumns />}
            label="Layouts"
            rightIcon={<FaAngleRight />}
          />
          <SidebarGroupItem
            icon={<FaBookOpen />}
            label="Pages"
            rightIcon={<FaAngleRight />}
          />
        </SidebarGroup>

        <SidebarGroup label="ADDONS">
          <SidebarGroupItem icon={<FaChartArea />} label="Charts" />
          <SidebarGroupItem icon={<FaTable />} label="Tables" />
        </SidebarGroup>

      </div>
    </aside>
  );
}
