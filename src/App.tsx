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
                    <Route
                        path="/addaccessory"
                        element={
                            <ProtectedRoute adminRoute={true}>
                                <AddAccessory/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/products/:id" element={<ViewProduct/>}/>

                </Routes>
            </Router>
        </div>
    );
};

export default App;
