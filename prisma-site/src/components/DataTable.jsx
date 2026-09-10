import { useState } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export default function DataTable({ columns, data, globalFilter, pageSize = 200 }) {
  const [sorting, setSorting] = useState([]);
  const table = useReactTable({
    data, columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows.slice(0, pageSize);

  return (
    <div className="overflow-x-auto card">
      <table className="w-full text-[13.5px] border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-line bg-tint/40">
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  onClick={h.column.getToggleSortingHandler()}
                  className="text-left px-3.5 py-2.5 font-semibold text-[12px] uppercase tracking-wide text-muted cursor-pointer select-none whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() && <ArrowUpDown size={11} />}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line hover:bg-tint/30">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3.5 py-2.5 align-top">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="p-8 text-center text-muted text-[13.5px]">Nessun risultato con questi filtri.</div>
      )}
    </div>
  );
}
