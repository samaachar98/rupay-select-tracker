// Data table columns configuration
import { ColumnDef } from "@tanstack/react-table"
import type { Voucher } from "../lib/schema"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import { Pencil, Trash2 } from "lucide-react"

export const columns: ColumnDef<Voucher>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "cardName",
    header: "Card Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("cardName")}</div>
    ),
  },
  {
    accessorKey: "voucherName",
    header: "Voucher/Benefit",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("voucherName")}</div>
    ),
  },
  {
    accessorKey: "cardType",
    header: "Cycle Type",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("cardType")}
      </div>
    ),
  },
  {
    id: "quarters",
    header: "Quarters",
    columns: [
      {
        id: "q1",
        header: "Q1",
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.q1}
            onCheckedChange={(value) => {
              console.log('Toggle Q1', row.original.id, value)
              // TODO: Call toggleQuarter(row.original.id, 'q1', !!value)
            }}
          />
        ),
      },
      {
        id: "q2",
        header: "Q2",
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.q2}
            onCheckedChange={(value) => {
              console.log('Toggle Q2', row.original.id, value)
              // TODO: Call toggleQuarter(row.original.id, 'q2', !!value)
            }}
          />
        ),
      },
      {
        id: "q3",
        header: "Q3",
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.q3}
            onCheckedChange={(value) => {
              console.log('Toggle Q3', row.original.id, value)
              // TODO: Call toggleQuarter(row.original.id, 'q3', !!value)
            }}
          />
        ),
      },
      {
        id: "q4",
        header: "Q4",
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.q4}
            onCheckedChange={(value) => {
              console.log('Toggle Q4', row.original.id, value)
              // TODO: Call toggleQuarter(row.original.id, 'q4', !!value)
            }}
          />
        ),
      },
    ],
  },
  {
    id: "halfYears",
    header: "Half-Years",
    columns: [
      {
        id: "halfYear1",
        header: "H1",
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.halfYear1}
            onCheckedChange={(value) => {
              // TODO: Implement redemption marking
            }}
          />
        ),
      },
      {
        id: "halfYear2",
        header: "H2",
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.halfYear2}
            onCheckedChange={(value) => {
              // TODO: Implement redemption marking
            }}
          />
        ),
      },
    ],
  },
  {
    id: "yearly",
    header: "Yearly",
    cell: ({ row }) => (
      <Checkbox
        checked={row.original.yearly}
        onCheckedChange={(value) => {
          // TODO: Implement redemption marking
        }}
      />
    ),
  },
  {
    accessorKey: "lastRedeemed",
    header: "Last Redeemed",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-red-500">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]