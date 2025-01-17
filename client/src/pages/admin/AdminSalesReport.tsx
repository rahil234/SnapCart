import React, { useEffect, useState } from 'react';
import salesEndpoints from '@/api/salesEndpoints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import DatePickerWithRange from '@/components/ui/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: object) => void;
}

interface SalesData {
  _id: string | null;
  totalOrders: number;
  totalSales: number;
  totalDiscountApplied: number;
  netSales: number;
  totalItemsSold: number;
  date: string | null;
  startDate: string | null;
  endDate: string | null;
}

export default function SalesReport() {
  const [timeframe, setTimeframe] = useState('daily');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const queryClient = useQueryClient();

  const {
    data: salesData,
    isLoading,
    error,
  } = useQuery<SalesData[]>({
    queryKey: ['sales'],
    queryFn: async () =>
      await salesEndpoints.fetchSalesData(timeframe, startDate, endDate),
  });

  useEffect(() => {
    console.log(salesData);
  }, [salesData]);

  const fetchSalesReport = async () => {
    await queryClient.invalidateQueries({ queryKey: ['sales'] });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !salesData) return <div>Error: {error?.message}</div>;

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setStartDate(range.from.toISOString().split('T')[0]);
      setEndDate(range.to.toISOString().split('T')[0]);
    }
  };

  const handleApplyFilter = async () => {
    await fetchSalesReport();
  };

  const totalOrders = salesData.reduce(
    (sum, sale) => sum + sale.totalOrders,
    0
  );
  const totalSales = salesData.reduce((sum, sale) => sum + sale.totalSales, 0);
  const totalItemsSold = salesData.reduce(
    (sum, sale) => sum + sale.totalItemsSold,
    0
  );

  const downloadPDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Embed and use the font
    // doc.addFileToVFS('Roboto-Regular-normal.ts', robotoRegular);
    // doc.addFont('Roboto-Regular-normal.ttf', 'Roboto', 'normal');
    // doc.setFont('Roboto');

    doc.text('₹ Test', 10, 10);
    doc.text('Sales Report', 14, 15);
    doc.setFontSize(11);
    doc.text(`Total Orders: ${totalOrders}`, 14, 25);
    doc.text(`Total Sales: ₹${totalSales.toFixed(2)}`, 14, 32);
    doc.text(`Total Items Sold: ${totalItemsSold}`, 14, 39);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 53);

    const tableColumn = ['Date', 'Orders', 'Sales', 'Items Sold', 'Net Sales'];
    const tableRows = salesData.map(sale => [
      sale.date || 'N/A',
      sale.totalOrders,
      `₹${sale.totalSales.toFixed(2)}`,
      sale.totalItemsSold,
      `₹${sale.netSales.toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
    });

    doc.save('sales_report.pdf');
  };

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Data');

    worksheet.addRow([
      'Date',
      'Orders',
      'Sales',
      'Discount',
      'Net Sales',
      'Items Sold',
    ]);

    salesData.forEach(sale => {
      worksheet.addRow([
        sale.date || 'N/A',
        sale.totalOrders,
        sale.totalSales.toFixed(2),
        sale.totalDiscountApplied.toFixed(2),
        sale.netSales.toFixed(2),
        sale.totalItemsSold,
      ]);
    });

    // Adjust column widths
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Save the file
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'sales_report.xlsx');
  };

  return (
    <Card className="m-4">
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>Sales Report</CardTitle>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
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
        <div className="mb-6 flex gap-4 items-end w-full">
          <div className="space-y-2 w-[130px]">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <DatePickerWithRange
              disabled={date => date > new Date()}
              initialDate={{
                from: new Date(startDate),
                to: new Date(endDate),
              }}
              onDateChange={handleDateChange}
            />
          </div>
          <div className="space-y-2 justify-self-end">
            <Button onClick={handleApplyFilter}>
              <Filter className="w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Items Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItemsSold}</div>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Net Sales</TableHead>
                <TableHead>Items Sold</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale, index) => (
                <React.Fragment key={sale._id || index}>
                  <TableRow key={sale._id || index}>
                    <TableCell>{sale.date?.toString()}</TableCell>
                    <TableCell>{sale.totalOrders}</TableCell>
                    <TableCell>₹{sale.totalSales.toFixed(2)}</TableCell>
                    <TableCell>
                      ₹{sale.totalDiscountApplied.toFixed(2)}
                    </TableCell>
                    <TableCell>₹{sale.netSales.toFixed(2)}</TableCell>
                    <TableCell>{sale.totalItemsSold}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
