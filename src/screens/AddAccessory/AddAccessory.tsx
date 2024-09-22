import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label} from "reactstrap";
import {addAccessory, getProducts, SuccessfullProduct} from "../../sevices/ProductService";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

const AddAccessory: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [price, setPrice] = useState<number>(0.0);
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [products, setProducts] = useState<SuccessfullProduct[]>([]);  // Updated to hold products
    const [selectedProductId, setSelectedProductId] = useState<string>('');  // To hold selected product ID
    const [productCategory, setProductCategory] = useState('');
    const navigate = useNavigate();

    // Fetch products when the component mounts
    useEffect(() => {
        getProducts().then((res) => {
            console.log(res);
            setProducts(res.products);  // Set the fetched products into state
        });
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price.toString());
        formData.append('description', description);
        formData.append('product_id', selectedProductId);  // Append selected product ID
        if (image) {
            formData.append('image', image);
        }

        console.log('Form Submitted:', formData.values());
        addAccessory(formData, selectedProductId).then((res) => {
            console.log("RES :_ ", res);
            Swal.fire({
                title: "Success!",
                icon: "success",
                text: "Accessory Added Successfully!",
            }).then(() => navigate("/"))
        }, (err) => {
            console.log("err :_ ", err)
            Swal.fire({
                title: "Error!",
                icon: "error",
                text: "Accessory Addition Failed!",
            });
        })
    };

    return (
        <Card style={{
            padding: '10px',
            margin: '20px'
        }}>
            <CardTitle>
                <h1>Add Accessory</h1>
            </CardTitle>
            <CardBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup row>
                        <Label for="name" sm={2}>Accessory Name</Label>
                        <Col sm={10}>
                            <Input type="text" name="name" id="accessoryName" placeholder="Enter Accessory Name"
                                   value={name}
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
                                value={productCategory}  // Set the value to category state
                                onChange={(e) => setProductCategory(e.target.value)}
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
                        <Label for="product" sm={2}>Select Product</Label>
                        <Col sm={10}>
                            <Input
                                type="select"
                                name="product"
                                id="productSelect"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                disabled={productCategory === ""}
                            >
                                <option value="">Select a Product</option>
                                {products.filter((p) => p.category === productCategory).map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
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
                        <Label for="price" sm={2}>Accessory Price</Label>
                        <Col sm={10}>
                            <Input
                                type="number"
                                name="price"
                                id="accessoryPrice"
                                placeholder="Enter Accessory Price"
                                step="0.01"
                                value={price || ""}
                                onChange={e => setPrice(parseFloat(e.target.value))}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label for="description" sm={2}>Accessory Description</Label>
                        <Col sm={10}>
                            <Input
                                type="textarea"
                                name="description"
                                id="accessoryDescription"
                                placeholder="Enter Accessory Description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}/>
                        </Col>
                    </FormGroup>

                    <Button type="submit" color="primary">
                        Add Accessory
                    </Button>
                </Form>
            </CardBody>
        </Card>
    );
};

export default AddAccessory;
