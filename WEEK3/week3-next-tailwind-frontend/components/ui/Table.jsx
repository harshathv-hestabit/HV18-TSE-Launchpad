"use client";

import { useState, useMemo } from "react";

export default function DataTable({ columns = [], data = [] }) {
  const [entries, setEntries] = useState(10); // entries per page
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filter search
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / entries);
  const paginatedData = filteredData.slice(
    (page - 1) * entries,
    page * entries
  );

  return (
    <div className="bg-white shadow rounded p-4 mt-6">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">

        {/* Show Entries */}
        <div className="flex items-center gap-2 text-sm">
          <span>Show</span>
          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setPage(1); // reset to first page
            }}
            className="border rounded p-1"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        {/* Search Bar */}
        <div className="text-sm">
          <label className="mr-2">Search:</label>
          <input
            type="text"
            className="border rounded p-1"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to first page on search
            }}
          />
        </div>

      </div>

      {/* Table */}
      <table className="min-w-full text-sm border rounded bg-white">
        <thead className="bg-gray-100 border-b">
          <tr>
            {columns.map((col) => (
              <th className="text-left px-4 py-2 font-semibold" key={col.key}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Bottom Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">

        {/* Showing x to y of z entries */}
        <span>
          Showing{" "}
          {filteredData.length === 0 ? 0 : (page - 1) * entries + 1} to{" "}
          {Math.min(page * entries, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 border rounded ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 border rounded ${
              page === totalPages || totalPages === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
