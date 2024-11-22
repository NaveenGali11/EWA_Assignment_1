import React from "react";
import "./App.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Header from "./components/Header";
import Register from "./screens/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./screens/AddProduct/AddProduct";
import ViewProduct from "./components/ViewProduct/ViewProduct";
import AddAccessory from "./screens/AddAccessory/AddAccessory";
import Cart from "./screens/Cart/Cart";
import Orders from "./screens/Orders/Orders";
import OrderOverview from "./screens/OrderOverview/OrderOverview";
import FilteredProductsPage from "./screens/FilteredProducts";
import Stats from "./screens/Stats";
import InventoryReport from "./screens/InventoryReport";
import SalesReport from "./screens/SalesReport";
import {OpenTicket} from "./screens/customerservice/OpenTicket";
import {TrackTicket} from "./screens/customerservice/TrackTicket";
import RecommendProducts from "./screens/RecommendProducts";

const App = () => {
    return (
        <div className="App">
            <Router>
                <Header/> {/* Now Header is within the Router */}
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route
                        path="/addproduct"
                        element={
                            <ProtectedRoute adminRoute={true}>
                                <AddProduct/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/recommendproducts" element={<RecommendProducts/>}/>
                    <Route
                        path="/openticket"
                        element={
                            <ProtectedRoute adminRoute={false}>
                                <OpenTicket/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/trackticket"
                        element={
                            <ProtectedRoute adminRoute={false}>
                                <TrackTicket/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/stats"
                        element={
                            <ProtectedRoute adminRoute={true}>
                                <Stats/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/addaccessory"
                        element={
                            <ProtectedRoute adminRoute={true}>
                                <AddAccessory/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/inventory-report" element={
                        <ProtectedRoute adminRoute={true}>
                            <InventoryReport/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/sales-report" element={
                        <ProtectedRoute adminRoute={true}>
                            <SalesReport/>
                        </ProtectedRoute>
                    }/>
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute adminRoute={true}>
                                <Orders/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:confirmation_number"
                        element={
                            <ProtectedRoute adminRoute={true}>
                                <OrderOverview/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/products/most-reviewed" element={<FilteredProductsPage filterType="most-reviewed"/>}/>
                    <Route path="/products/top-rated" element={<FilteredProductsPage filterType="top-rated"/>}/>
                    <Route path="/products/trending" element={<FilteredProductsPage filterType="trending"/>}/>
                    <Route path="/products/:id" element={<ViewProduct/>}/>
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute adminRoute={false}>
                                <Cart/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
