export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">💳 Rupay Select Voucher Tracker</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Your Cards</h2>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">💳 Bank of Baroda (Sourabh)</h3>
              <span className="text-sm text-gray-500">Quarterly Benefits</span>
            </div>
            
            <div className="flex gap-2 justify-end">
              <input type="checkbox" className="w-4 h-4" /> Q1
              <input type="checkbox" className="w-4 h-4" /> Q2
              <input type="checkbox" className="w-4 h-4" /> Q3
              <input type="checkbox" className="w-4 h-4" /> Q4
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">💳 Canara Bank</h3>
              <span className="text-sm text-gray-500">Yearly Benefits</span>
            </div>
            
            <div className="flex gap-2 justify-end">
              <input type="checkbox" className="w-4 h-4" /> Yearly
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">💡 How to Use</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Check the box when you redeem a voucher</li>
          <li>Use this to track which benefits you've used</li>
          <li>Reset at the start of each cycle</li>
        </ul>
      </div>
    </div>
  )
}