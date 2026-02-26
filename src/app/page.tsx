import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"
import { getVouchers } from "./actions"
import type { Voucher } from "@/lib/schema"
import { Suspense } from "react"

async function VoucherTable() {
  const data = await getVouchers()
  return <DataTable columns={columns} data={data} />
}

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">💳 Rupay Select Voucher Tracker</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Cards</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Vouchers</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<div>Loading...</div>}>
                <VoucherTable />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quarterly">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Quarterly vouchers filtered here (TBD)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}