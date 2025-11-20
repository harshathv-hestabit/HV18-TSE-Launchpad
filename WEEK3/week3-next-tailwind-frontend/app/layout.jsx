import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata = {
  title: "Week 3 Next.js + TailWindCSS Frontend",
  description: "TSE LAUNCHPAD WEEK 3 TASKS",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
