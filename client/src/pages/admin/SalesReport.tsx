import React, { useState, useEffect } from 'react'
import salesEndpoints from '@/api/salesEndpoints'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'


interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: object) => void;
}

interface SalesData {
    id: number;
    date: string;
    product: string;
    quantity: number;
    revenue: number;
}

export default function SalesReport() {
    const [salesData, setSalesData] = useState<SalesData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadSalesData = async () => {
            try {
                const data = await salesEndpoints.fetchSalesData()
                setSalesData(data)
                setIsLoading(false)
            } catch (err) {
                console.log(err);
                setError('Failed to fetch sales data')
                setIsLoading(false)
            }
        }

        loadSalesData()
    }, [])

    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.revenue, 0)
    const totalQuantity = salesData.reduce((sum, sale) => sum + sale.quantity, 0)

    const downloadPDF = () => {
        const doc = new jsPDF() as jsPDFWithAutoTable
        doc.text('Sales Report', 14, 15)
        doc.setFontSize(11)
        doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 25)
        doc.text(`Total Quantity Sold: ${totalQuantity}`, 14, 32)

        const tableColumn = ["Date", "Product", "Quantity", "Revenue"]
        const tableRows = salesData.map(sale => [
            sale.date,
            sale.product,
            sale.quantity,
            `$${sale.revenue.toFixed(2)}`
        ])

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40
        })

        doc.save('sales_report.pdf')
    }

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(salesData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data")
        XLSX.writeFile(workbook, "sales_report.xlsx")
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <Card className="m-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales Report</CardTitle>
                <div className="space-x-2">
                    <Button onClick={downloadPDF} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button onClick={downloadExcel} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Excel
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Quantity Sold</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalQuantity}</div>
                        </CardContent>
                    </Card>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Revenue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salesData.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell>{sale.date}</TableCell>
                                <TableCell>{sale.product}</TableCell>
                                <TableCell>{sale.quantity}</TableCell>
                                <TableCell>${sale.revenue.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}