import "./globals.css";
import ClientLayout from "./client-layout";
import { Montserrat } from 'next/font/google'
 
const smm = Montserrat({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "Week 3 Next.js + TailWindCSS Frontend",
  description: "TSE LAUNCHPAD WEEK 3 TASKS",
};

export default function Layout({ children }) {
  return (
    <html className={smm.className} lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
