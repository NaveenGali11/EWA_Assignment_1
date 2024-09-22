// @ts-ignore
import axios, {AxiosResponse} from "axios";
import {PRODUCTS_URL} from "../utils/urlUtils";

interface Product {
    name: string,
    category: string,
    price: number,
    description: string,
    on_sale: number,
    manufacturer: string,
    warranty: number,
    retailer_discount: number,
    image: string,
    manufacturer_rebate: number
}

interface ProductAccessory {
    id: string,
    product_id: string,
    price: number,
    name: string,
    description: string,
    image: string,
    imageUrl: string
}

interface AddProductResponse extends Product {
    message: string,
    product_id: number,
}

export interface SuccessfullProduct {
    id: string,
    category: string,
    description: string,
    image: string,
    imageUrl: string,
    manufacturer: string,
    manufacturer_rebate: number,
    name: string,
    on_sale: number,
    price: string,
    retailer_discount: number,
    warranty: number,
}

export interface FullProduct extends SuccessfullProduct {
    accessories?: ProductAccessory[];
}

interface GetProductResponse {
    products: SuccessfullProduct[]
}

export const addAccessory = async (accessory: FormData, productId: string) => {
    try {
        const response: AxiosResponse<AddProductResponse> = await axios.post(PRODUCTS_URL + "/" + productId + "/accessories", accessory, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Server responded with a non-2xx status code
            throw new Error(error.response.data.message || 'Add Accessory failed');
        } else if (error.request) {
            // No response was received
            throw new Error('No response from the server');
        } else {
            // Other errors (e.g., setup issue)
            throw new Error(`Add Accessory error: ${error.message}`);
        }
    }
}

export const addProduct = async (product: FormData) => {
    try {
        const response: AxiosResponse<AddProductResponse> = await axios.post(PRODUCTS_URL, product, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Server responded with a non-2xx status code
            throw new Error(error.response.data.message || 'Add Product failed');
        } else if (error.request) {
            // No response was received
            throw new Error('No response from the server');
        } else {
            // Other errors (e.g., setup issue)
            throw new Error(`Add Product error: ${error.message}`);
        }
    }
}

export const getProducts = async () => {
    try {
        const response: AxiosResponse<GetProductResponse> = await axios.get(PRODUCTS_URL);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Server responded with a non-2xx status code
            throw new Error(error.response.data.message || 'Product Fetch failed');
        } else if (error.request) {
            // No response was received
            throw new Error('No response from the server');
        } else {
            // Other errors (e.g., setup issue)
            throw new Error(`Product Fetch error: ${error.message}`);
        }
    }
}

export const getSingleProduct = async (productId: string) => {
    try {
        const response: AxiosResponse<FullProduct> = await axios.get(PRODUCTS_URL + "/" + productId);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Server responded with a non-2xx status code
            throw new Error(error.response.data.message || 'Product Fetch failed');
        } else if (error.request) {
            // No response was received
            throw new Error('No response from the server');
        } else {
            // Other errors (e.g., setup issue)
            throw new Error(`Product Fetch error: ${error.message}`);
        }
    }
}