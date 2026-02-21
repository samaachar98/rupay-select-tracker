// Rupay Select Voucher Tracker
// Main page with editable tables for tracking card benefits

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"

// Sample data - will be replaced with actual Rupay Select benefits after research
const sampleData = [
  {
    id: "1",
    cardName: "Bank of Baroda (Sourabh)",
    cardType: "Quarterly",
    voucherName: "Cult.Fit Membership",
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    halfYear1: false,
    halfYear2: false,
    yearly: false,
    lastRedeemed: "-",
    notes: "3 months membership"
  },
  {
    id: "2",
    cardName: "Canara Bank",
    cardType: "Yearly",
    voucherName: "Amazon Prime",
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    halfYear1: false,
    halfYear2: false,
    yearly: false,
    lastRedeemed: "-",
    notes: "1 year subscription"
  }
]

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">💳 Rupay Select Voucher Tracker</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Cards</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="halfyear">Half-Year</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Vouchers</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={sampleData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quarterly">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={sampleData.filter(item => item.cardType === "Quarterly")} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="halfyear">
          <Card>
            <CardHeader>
              <CardTitle>Half-Year Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={sampleData.filter(item => item.cardType === "Half-Year")} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="yearly">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={sampleData.filter(item => item.cardType === "Yearly")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}