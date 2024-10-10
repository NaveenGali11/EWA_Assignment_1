import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Chart} from 'react-google-charts';
import {Container, Table} from 'reactstrap';
import {SALES_REPORT_URL} from "../utils/urlUtils";

interface ProductSale {
    name: string;
    price: number;
    total_quantity_sold: number;
    total_sales: number;
}

interface DailySale {
    sale_date: string;
    daily_sales: number;
}

const SalesReport: React.FC = () => {
    const [productSales, setProductSales] = useState<ProductSale[]>([]);
    const [dailySales, setDailySales] = useState<DailySale[]>([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchSalesReport = async () => {
            try {
                const {data}: any = await axios.get(SALES_REPORT_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const sortedProductSales = data.productSales.sort((a: ProductSale, b: ProductSale) => b.total_sales - a.total_sales);
                setProductSales(sortedProductSales);
                setDailySales(data.dailySales);
            } catch (error) {
                console.error('Error fetching sales report:', error);
            }
        };

        fetchSalesReport();
    }, []);

    // Prepare data for bar chart
    const chartData = [
        ['Product', 'Total Sales ($)'],
        ...productSales.map((sale) => [sale.name, Number(sale.total_sales)]),
    ];

    const chartOptions = {
        title: 'Total Sales by Product',
        hAxis: {title: 'Product'},
        vAxis: {title: 'Total Sales ($)'},
    };

    return (
        <Container>
            <h1>Sales Report</h1>

            {/* Product Sales Table */}
            <h2>Product Sales</h2>
            <Table bordered striped responsive>
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price ($)</th>
                    <th>Quantity Sold</th>
                    <th>Total Sales ($)</th>
                </tr>
                </thead>
                <tbody>
                {productSales.map((sale, index) => (
                    <tr key={index}>
                        <td>{sale.name}</td>
                        <td>{sale.price}</td>
                        <td>{sale.total_quantity_sold}</td>
                        <td>{sale.total_sales}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Bar Chart for Total Sales by Product */}
            <h2>Total Sales by Product</h2>
            <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={chartData}
                options={chartOptions}
            />

            {/* Daily Sales Transactions Table */}
            <h2>Daily Sales Transactions</h2>
            <Table bordered striped responsive>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Total Sales ($)</th>
                </tr>
                </thead>
                <tbody>
                {dailySales.map((sale, index) => (
                    <tr key={index}>
                        <td>{sale.sale_date}</td>
                        <td>{sale.daily_sales}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default SalesReport;
