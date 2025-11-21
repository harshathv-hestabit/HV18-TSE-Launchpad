"use client";

import { useState, useMemo } from "react";

export default function DataTable({ columns = [], data = [] }) {
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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

      <div className="flex items-center text-gray-500 justify-between mb-4 mr-2">
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

          <div className="ml-4 flex text-sm">
            <label className="mr-2">Search:</label>
            <input
              type="text"
              className="border rounded p-1"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        

      </div>
      <table className="min-w-full text-sm border rounded text-gray-700 bg-white">
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

      <div className="flex text-gray-500 justify-between items-center mt-4 text-sm">

        <span>
          Showing{" "}
          {filteredData.length === 0 ? 0 : (page - 1) * entries + 1} to{" "}
          {Math.min(page * entries, filteredData.length)} of{" "}
          {filteredData.length} entries
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 border rounded ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
          >
            Previous
          </button>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 border rounded ${page === totalPages || totalPages === 0
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
