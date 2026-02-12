import 'jspdf-autotable';
import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { DateRange } from 'react-day-picker';
import { Download, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AnalyticsService } from '@/services/analytics.service';
import DatePickerWithRange from '@/components/ui/DatePickerWithRange';
import {
  AnalyticsControllerGetSalesReportTimeframeEnum,
  SalesReportItemDto,
} from '@/api/generated';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: object) => void;
}

function SellerSalesReport() {
  const [timeframe, setTimeframe] =
    useState<AnalyticsControllerGetSalesReportTimeframeEnum>(
      AnalyticsControllerGetSalesReportTimeframeEnum.Daily
    );
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
  } = useQuery<SalesReportItemDto[]>({
    queryKey: ['seller-sales-report', timeframe, startDate, endDate],
    queryFn: () =>
      AnalyticsService.getSalesReport(timeframe, startDate, endDate),
  });

  const fetchSalesReport = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['seller-sales-report'],
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !salesData) return <div>Error: {String(error)}</div>;

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
    doc.text('Sales Report', 14, 15);
    doc.setFontSize(11);
    doc.text(`Total Orders: ${totalOrders}`, 14, 25);
    doc.text(`Total Sales: ₹${totalSales.toFixed(2)}`, 14, 32);
    doc.text(`Total Items Sold: ${totalItemsSold}`, 14, 39);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 46);

    const tableColumn = ['Date', 'Orders', 'Sales', 'Items Sold', 'Net Sales'];
    const tableRows = salesData.map(sale => [
      sale.date ? String(sale.date) : 'N/A',
      sale.totalOrders,
      `₹${sale.totalSales.toFixed(2)}`,
      sale.totalItemsSold,
      `₹${sale.netSales.toFixed(2)}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 53,
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
        sale.date ? String(sale.date) : 'N/A',
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
  if (error) return <div>Error: {error}</div>;

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
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select
              value={timeframe}
              onValueChange={value =>
                setTimeframe(
                  value as AnalyticsControllerGetSalesReportTimeframeEnum
                )
              }
            >
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={AnalyticsControllerGetSalesReportTimeframeEnum.Daily}
                >
                  Daily
                </SelectItem>
                <SelectItem
                  value={AnalyticsControllerGetSalesReportTimeframeEnum.Weekly}
                >
                  Weekly
                </SelectItem>
                <SelectItem
                  value={AnalyticsControllerGetSalesReportTimeframeEnum.Monthly}
                >
                  Monthly
                </SelectItem>
                <SelectItem
                  value={AnalyticsControllerGetSalesReportTimeframeEnum.Yearly}
                >
                  Yearly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <DatePickerWithRange
              disabled={date => date > new Date()}
              initialDate={{
                from: new Date(startDate),
                to: new Date(endDate),
              }}
              onDateChange={handleDateChange}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleApplyFilter} className="w-full">
              <Filter className="mr-2 h-4 w-4" />
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
                <TableRow key={index}>
                  <TableCell>{sale.date ? String(sale.date) : 'N/A'}</TableCell>
                  <TableCell>{sale.totalOrders}</TableCell>
                  <TableCell>₹{sale.totalSales.toFixed(2)}</TableCell>
                  <TableCell>₹{sale.totalDiscountApplied.toFixed(2)}</TableCell>
                  <TableCell>₹{sale.netSales.toFixed(2)}</TableCell>
                  <TableCell>{sale.totalItemsSold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default SellerSalesReport;
