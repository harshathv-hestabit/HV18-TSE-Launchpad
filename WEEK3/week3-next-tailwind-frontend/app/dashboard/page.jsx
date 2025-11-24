export const metadata = {
  title: "Dashboard",
  description: "View your personalized dashboard",
};

import Dashboard from "@/components/ui/Dashboard";
export default function Page() {
  return (
    <div className="h-full space-y-8">
      <Dashboard/>
   </div>
  );
}