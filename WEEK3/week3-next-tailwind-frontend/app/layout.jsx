import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "Week 3 Next.js + TailWindCSS Frontend",
  description: "TSE LAUNCHPAD WEEK 3 TASKS",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-64">
            <Navbar />
            <main className="flex-1 bg-gray-100 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
