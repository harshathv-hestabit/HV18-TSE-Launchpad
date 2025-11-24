export const metadata = {
  title: "Users",
  description: "Access active users.",
};

import DataTable from "@/components/ui/Table";
import { FaUserSecret } from "react-icons/fa";

export default function UsersPage() {
  const columns = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Created at", key: "createdAt" },
    { label: "Updated at", key: "updatedAt" },
    { label: "", key: "actions" },
  ];

  const users = [
    {
      name: "User",
      email: "user@example.com",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Dr. Ray Stoltenberg",
      email: "rosalinda42@example.com",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Mrs. Mertie Murray MD",
      email: "ernser.susanna@example.net",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Gilbert Rice",
      email: "willard.walter@example.org",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Sydnie Rau",
      email: "doug.padberg@example.org",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Mr. Arvid Veum DDS",
      email: "schinner.meaghan@example.org",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Jayme Beier DDS",
      email: "orn.ahmed@example.com",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Uriah Swaniawski",
      email: "wilburn.champlin@example.org",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Rosanna Heaney",
      email: "boconnor@example.com",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
    {
      name: "Adan Reichel",
      email: "mya.labadie@example.com",
      role: "User",
      createdAt: "18/10/2024 05:27",
      updatedAt: "18/10/2024 05:27",
      actions:<FaUserSecret/>
    },
  ];

  return (
    <div className="p-6">
      <div className="text-sm text-gray-500 mb-2">
        Users <span className="mx-1">›</span> List
      </div>

      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Users</h1>

      <DataTable columns={columns} data={users} />
    </div>
  );
}
