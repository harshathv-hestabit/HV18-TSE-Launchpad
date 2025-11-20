export default function Card({ title, icon, children, classProp }) {
  return (
    <div className={`shadow rounded-lg ${classProp}`}>
      <div className={!classProp ? "bg-gray-300 flex p-6 gap-2" : "flex p-6 gap-2"}>
        {icon && <h3>{icon}</h3>}
        {title && <h3 className="font-semibold">{title}</h3>}
      </div>
      {children}
    </div>
  );
}
