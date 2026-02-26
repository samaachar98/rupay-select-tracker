import { getVouchers } from "./actions"
import type { Voucher } from "../lib/schema"
import { Suspense } from "react"

async function VoucherTable() {
  const data = await getVouchers()
  // For now, show a simple table - can enhance with DataTable later
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q1</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q2</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q3</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Q4</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No vouchers yet. Add your first card!</td>
            </tr>
          ) : (
            data.map((voucher: Voucher) => (
              <tr key={voucher.id}>
                <td className="px-6 py-4 whitespace-nowrap">{voucher.cardName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{voucher.voucherName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{voucher.cardType ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" checked={voucher.q1} readOnly className="h-4 w-4" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" checked={voucher.q2} readOnly className="h-4 w-4" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" checked={voucher.q3} readOnly className="h-4 w-4" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" checked={voucher.q4} readOnly className="h-4 w-4" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">💳 Rupay Select Voucher Tracker</h1>
        
        <div className="mb-6 flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">All Cards</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Quarterly</button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All Vouchers</h2>
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <VoucherTable />
          </Suspense>
        </div>
      </div>
    </div>
  )
}