import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { BookStats, SalesData } from '../../types';

const mockSalesData: SalesData[] = [
  { date: '2024-01', revenue: 15000000, orders: 120 },
  { date: '2024-02', revenue: 18000000, orders: 150 },
  { date: '2024-03', revenue: 22000000, orders: 180 },
];

const mockBookStats: BookStats = {
  totalBooks: 1250,
  outOfStock: 15,
  lowStock: 45,
  categories: [
    { name: 'Văn học', count: 450 },
    { name: 'Kinh tế', count: 300 },
    { name: 'Tâm lý học', count: 250 },
    { name: 'Lifestyle', count: 250 },
  ],
};

export function Dashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tổng quan
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary" variant="subtitle2">
              Tổng số sách
            </Typography>
            <Typography variant="h4">{mockBookStats.totalBooks}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary" variant="subtitle2">
              Hết hàng
            </Typography>
            <Typography variant="h4" color="error">
              {mockBookStats.outOfStock}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary" variant="subtitle2">
              Sắp hết hàng
            </Typography>
            <Typography variant="h4" color="warning.main">
              {mockBookStats.lowStock}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary" variant="subtitle2">
              Doanh thu tháng
            </Typography>
            <Typography variant="h4" color="success.main">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(mockSalesData[2].revenue)}
            </Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo tháng
            </Typography>
            <BarChart
              series={[
                {
                  data: mockSalesData.map((d) => d.revenue / 1000000),
                  label: 'Doanh thu (triệu VNĐ)',
                },
              ]}
              height={300}
              xAxis={[{ data: mockSalesData.map((d) => d.date), scaleType: 'band' }]}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân bố theo danh mục
            </Typography>
            <BarChart
              series={[
                {
                  data: mockBookStats.categories.map((c) => c.count),
                  label: 'Số lượng sách',
                },
              ]}
              height={300}
              xAxis={[{ 
                data: mockBookStats.categories.map((c) => c.name),
                scaleType: 'band'
              }]}
              layout="vertical"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}