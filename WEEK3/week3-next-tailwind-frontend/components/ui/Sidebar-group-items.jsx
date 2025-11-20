export default function SidebarGroupItem({ icon: Icon, label, rightIcon: Right }) {
  return (
    <li className="py-2 flex items-center justify-between text-gray-300 cursor-pointer hover:text-white">
      <div className="flex items-center gap-2">
        {Icon}
        <p>{label}</p>
      </div>
      {Right}
    </li>
  );
}