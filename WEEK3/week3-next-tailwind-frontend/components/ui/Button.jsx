export default function Button({ children, variant = "primary", ...props }) {
  const base =
    "px-6 py-4 w-full rounded-sm font-medium text-sm transition inset-shadow-sm flex justify-between";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}