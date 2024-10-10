import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import {INVENTORY_URL} from "../utils/urlUtils";
import {Container, Table} from "reactstrap";
import {Chart} from "react-google-charts";

// Define the structure of the data returned from the backend
interface Product {
    name: string;
    price: number;
    stock_quantity: number;
}

interface RebateProduct extends Product {
    manufacturer_rebate: number;
}

const ITEMS_PER_PAGE = 10;

const InventoryReport: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
    const [rebateProducts, setRebateProducts] = useState<RebateProduct[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [onSaleCurrentPage, setOnSaleCurrentPage] = useState(0);
    const [rebateCurrentPage, setRebateCurrentPage] = useState(0);
    const token = localStorage.getItem("token");

    // Fetch the inventory data from the backend
    useEffect(() => {
        const fetchInventoryReport = async () => {
            try {
                const {data}: any = await axios.get(INVENTORY_URL, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });
                setAllProducts(data.allProducts);
                setOnSaleProducts(data.onSaleProducts);
                setRebateProducts(data.rebateProducts);
            } catch (error) {
                console.error('Error fetching inventory report:', error);
            }
        };
        fetchInventoryReport();
    }, []);

    // Prepare data for the bar chart
    const chartData = [
        ['Product', 'Stock Quantity'],
        ...allProducts.map((product) => [product.name, product.stock_quantity]),
    ];

    const chartOptions = {
        title: 'Inventory Stock Levels (Stacked)',
        chartArea: {width: '60%'},
        isStacked: true,  // Enables stacking
        hAxis: {
            title: 'Total Stock Quantity',
            minValue: 0,
        },
        vAxis: {
            title: 'Product',
        },
    };


    // Paginate All Products
    const offset = currentPage * ITEMS_PER_PAGE;
    const paginatedAllProducts = allProducts.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

    // Paginate On Sale Products
    const onSaleOffset = onSaleCurrentPage * ITEMS_PER_PAGE;
    const paginatedOnSaleProducts = onSaleProducts.slice(onSaleOffset, onSaleOffset + ITEMS_PER_PAGE);
    const onSalePageCount = Math.ceil(onSaleProducts.length / ITEMS_PER_PAGE);

    // Paginate Rebate Products
    const rebateOffset = rebateCurrentPage * ITEMS_PER_PAGE;
    const paginatedRebateProducts = rebateProducts.slice(rebateOffset, rebateOffset + ITEMS_PER_PAGE);
    const rebatePageCount = Math.ceil(rebateProducts.length / ITEMS_PER_PAGE);

    // Handlers for changing pages
    const handlePageClick = ({selected}: { selected: number }) => setCurrentPage(selected);
    const handleOnSalePageClick = ({selected}: { selected: number }) => setOnSaleCurrentPage(selected);
    const handleRebatePageClick = ({selected}: { selected: number }) => setRebateCurrentPage(selected);

    return (
        <Container>
            <div className="inventory-report">
                <h1>Inventory Report</h1>

                {/* All Products Table */}
                <h2>All Products</h2>
                <Table bordered striped responsive>
                    <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price ($)</th>
                        <th>Stock Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        paginatedAllProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock_quantity}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />

                {/* Bar Chart for Stock Levels */}
                <h2>Stock Levels</h2>
                <Chart
                    chartType="BarChart"
                    width="100%"
                    height="500px"
                    data={chartData}
                    options={chartOptions}
                />


                {/* On Sale Products Table */}
                <h2>Products on Sale</h2>
                <Table bordered striped responsive>
                    <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price ($)</th>
                        <th>Stock Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        paginatedOnSaleProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock_quantity}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    pageCount={onSalePageCount}
                    onPageChange={handleOnSalePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />

                {/* Products with Manufacturer Rebates Table */}
                <h2>Products with Manufacturer Rebates</h2>
                <Table bordered striped responsive>
                    <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price ($)</th>
                        <th>Stock Quantity</th>
                        <th>Manufacturer Rebate</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        paginatedRebateProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock_quantity}</td>
                                <td>{product.manufacturer_rebate === 0 ? "No" : "Yes"}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    pageCount={rebatePageCount}
                    onPageChange={handleRebatePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>
        </Container>
    );
};

export default InventoryReport;
