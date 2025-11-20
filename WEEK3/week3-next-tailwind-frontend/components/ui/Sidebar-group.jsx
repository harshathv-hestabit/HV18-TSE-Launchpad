export default function SidebarGroup({ label, children }) {
  return (
    <div className="px-4 py-4">
      <p className="text-gray-400 text-xs font-bold tracking-wide mb-2">
        {label}
      </p>
      <ul className="flex flex-col gap-4 py-4">{children}</ul>
    </div>
  );
}
