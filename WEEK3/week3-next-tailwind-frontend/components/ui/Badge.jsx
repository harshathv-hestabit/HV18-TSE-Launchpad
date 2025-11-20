export default function Badge({ children, color = "gray" }) {
  const colors = {
    gray: "bg-gray-200 text-gray-700",
    blue: "bg-blue-200 text-blue-700",
    green: "bg-green-200 text-green-700",
    red: "bg-red-200 text-red-700",
    yellow: "bg-yellow-200 text-yellow-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}