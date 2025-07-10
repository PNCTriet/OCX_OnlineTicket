"use client";
import { Ticket } from "../../types/ticket";

type TicketSummaryTableProps = {
  selectedTickets: (Ticket & { quantity: number })[];
  totalAmount: number;
};

export default function TicketSummaryTable({ selectedTickets, totalAmount }: TicketSummaryTableProps) {
  return (
    <div className="bg-zinc-900/30 rounded-xl p-6 shadow-lg backdrop-blur-sm text-white">
      <h2 className="text-xl font-bold mb-4">Chi tiết vé</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="py-2">Loại vé</th>
            <th className="py-2 text-center">SL</th>
            <th className="py-2 text-right">Giá</th>
          </tr>
        </thead>
        <tbody>
          {selectedTickets.filter(t => t.quantity > 0).map(ticket => (
            <tr key={ticket.id} className="border-b border-zinc-800 last:border-b-0">
              <td className="py-2">{ticket.name}</td>
              <td className="py-2 text-center">{ticket.quantity}</td>
              <td className="py-2 text-right">{ticket.price.toLocaleString()}đ</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="py-4 text-lg font-bold">Tổng cộng</td>
            <td className="py-4 text-lg font-bold text-right">{totalAmount.toLocaleString()}đ</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
} 