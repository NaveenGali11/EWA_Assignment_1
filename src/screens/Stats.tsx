import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { STATS_URL } from "../utils/urlUtils";
import { Col, Container, Row } from "reactstrap";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ProductCategorySaleData {
  category: string;
  total_sold: number;
}

interface ProductSaleData {
  name: string;
  total_sold: number;
}

interface ZipCodeOrder {
  zip: string;
  total_orders: number;
}

interface StorePickup {
  store_name: string;
  total_pickups: number;
}

const Stats: React.FC = () => {
  const [categorySalesData, setCategorySalesData] = useState<
    ProductCategorySaleData[]
  >([]);
  const [productSalesData, setProductSalesData] = useState<ProductSaleData[]>(
    []
  );
  const [zipCodeOrders, setZipCodeOrders] = useState<ZipCodeOrder[]>([]);
  const [storePickups, setStorePickups] = useState<StorePickup[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdminStats = async () => {
      const response: any = await axios.get(STATS_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setCategorySalesData(response.data.productCategorySales);
      setProductSalesData(response.data.productSales);
      setZipCodeOrders(response.data.zipCodeOrders);
      setStorePickups(response.data.storePickups);
    };

    fetchAdminStats();
  }, []);

  // Data for the Product Category Sales Chart
  const productCategorySalesData = {
    labels: categorySalesData.map((item) => item.category),
    datasets: [
      {
        label: "Products Sold by Category",
        data: categorySalesData.map((item) => item.total_sold),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  // Data for the Top Sold Products Chart
  const productSalesDataChart = {
    labels: productSalesData.map((item) => item.name),
    datasets: [
      {
        label: "Top Sold Products",
        data: productSalesData.map((item) => item.total_sold),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  // Data for Zip Code Orders
  const zipCodeOrdersData = {
    labels: zipCodeOrders.map((order) => `Zip Code: ${order.zip}`),
    datasets: [
      {
        label: "Orders by Zip Code",
        data: zipCodeOrders.map((order) => order.total_orders),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  // Data for Store Pickups
  const storePickupData = {
    labels: storePickups.map((store) => store.store_name),
    datasets: [
      {
        label: "Pickups by Store",
        data: storePickups.map((store) => store.total_pickups),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Customer Engagement Stats</h2>
      <Container>
        <Row>
          <Col lg="6">
            <div style={{ marginBottom: "40px" }}>
              <h2>Product Sales by Category</h2>
              <Bar
                data={productCategorySalesData}
                options={{
                  responsive: true,
                  scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </Col>
          <Col lg="6">
            <div style={{ marginBottom: "40px" }}>
              <h2>Top Sold Products</h2>
              <Bar
                data={productSalesDataChart}
                options={{
                  responsive: true,
                  scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <div style={{ marginBottom: "40px" }}>
              <h2>Orders by Zip Code (Home Delivery)</h2>
              <Pie data={zipCodeOrdersData} options={{
                responsive: true,
                // maintainAspectRatio: false
              }} />
            </div>
          </Col>
          <Col lg="6">
            <div style={{ marginBottom: "40px" }}>
              <h2>Store Pickups</h2>
              <Bar
                data={storePickupData}
                options={{
                  responsive: true,
                  scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Stats;
