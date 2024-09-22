import React, {useState} from 'react';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label} from "reactstrap";
import {addProduct} from "../../sevices/ProductService";
import Swal from 'sweetalert2';
import {useNavigate} from "react-router-dom";

const AddProduct: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [price, setPrice] = useState<number>(0.0);
    const [description, setDescription] = useState<string>('');
    const [onSale, setOnSale] = useState<boolean>(false);
    const [manufacturer, setManufacturer] = useState<string>('');
    const [warranty, setWarranty] = useState<boolean>(false);
    const [retailerDiscount, setRetailerDiscount] = useState<boolean>(false);
    const [manufacturerRebate, setManufacturerRebate] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price.toString());
        formData.append('description', description);
        formData.append('on_sale', onSale ? '1' : '0');
        formData.append('manufacturer', manufacturer);
        formData.append('warranty', warranty ? '1' : '0');
        formData.append('retailer_discount', retailerDiscount ? '1' : '0');
        formData.append('manufacturer_rebate', manufacturerRebate ? '1' : '0');
        if (image) {
            formData.append('image', image);
        }

        console.log('Form Submitted:', formData.values());

        addProduct(formData).then((res) => {
            console.log("RES :_ ", res);
            Swal.fire({
                title: "Success!",
                icon: "success",
                text: "Product Added Successfully!",
            }).then(() => navigate("/"))
        }, (err) => {
            console.log("err :_ ", err)
            Swal.fire({
                title: "Error!",
                icon: "error",
                text: "Product Addition Failed!",
            });
        })
    };

    return (
        <Card style={{
            padding: '10px',
            margin: '20px'
        }}>
            <CardTitle>
                <h1>Add Products</h1>
            </CardTitle>
            <CardBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup row>
                        <Label for="name" sm={2}>Product Name</Label>
                        <Col sm={10}>
                            <Input type="text" name="name" id="productName" placeholder="Enter Product Name"
                                   value={name} // Add value to bind the input
                                   onChange={(e) => setName(e.target.value)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="category" sm={2}>Product Category</Label>
                        <Col sm={10}>
                            <Input
                                type="select"
                                name="category"
                                id="productCategory"
                                value={category}  // Set the value to category state
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {/* Added a default empty option */}
                                <option value="doorbells">Smart Doorbells</option>
                                <option value="doorlocks">Smart DoorLocks</option>
                                <option value="speakers">Smart Speakers</option>
                                <option value="lightings">Smart Lightings</option>
                                <option value="thermostats">Smart Thermostats</option>
                            </Input>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="image" sm={2}>Image</Label>
                        <Col sm={10}>
                            <Input type="file" id="image" onChange={handleImageUpload}/>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="price" sm={2}>Product Price</Label>
                        <Col sm={10}>
                            <Input
                                type="number"
                                name="price"
                                id="productPrice"
                                placeholder="Enter Product Price"
                                step="0.01"  // Allows for decimal places like 12.99
                                value={price || ""}
                                onChange={e => setPrice(parseFloat(e.target.value))}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="description" sm={2}>Product Description</Label>
                        <Col sm={10}>
                            <Input type="textarea" name="description" id="productDescription"
                                   placeholder="Enter Product Description"
                                   value={description} // Add value to bind the input
                                   onChange={e => setDescription(e.target.value)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="name" sm={2}>Product Manufacturer</Label>
                        <Col sm={10}>
                            <Input type="text" name="manufacturer" id="productManufacturer"
                                   placeholder="Enter Product Manufacturer"
                                   value={manufacturer} // Add value to bind the input
                                   onChange={e => setManufacturer(e.target.value)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="onSale" sm={2}>On Sale</Label>
                        <Col sm={1}>
                            <Input type="checkbox" name="Onsale" id="productOnSale" checked={onSale}
                                   onChange={e => setOnSale(e.target.checked)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="warranty" sm={2}>Warranty</Label>
                        <Col sm={1}>
                            <Input type="checkbox" name="warranty" id="productWarranty" checked={warranty}
                                   onChange={e => setWarranty(e.target.checked)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="retailerDiscount" sm={2}>Retailer Discount</Label>
                        <Col sm={1}>
                            <Input type="checkbox" name="retailerDiscount" id="productRetailerDiscount"
                                   checked={retailerDiscount}
                                   onChange={e => setRetailerDiscount(e.target.checked)}/>
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="manufacturer_rebate" sm={2}>Manufacturer Rebate</Label>
                        <Col sm={1}>
                            <Input type="checkbox" name="manufacturer_rebate" id="productManufacturerRebate"
                                   checked={manufacturerRebate}
                                   onChange={e => setManufacturerRebate(e.target.checked)}/>
                        </Col>
                    </FormGroup>

                    <Button type="submit" color="primary">
                        Add Product
                    </Button>
                </Form>
            </CardBody>
        </Card>
    );
};

export default AddProduct;
