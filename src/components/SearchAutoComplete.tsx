import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Input, ListGroup, ListGroupItem} from 'reactstrap';
import {useNavigate} from 'react-router-dom';
import {AUTOCOMPLETE_PRODUCTS_URL, IMAGES_BASE_URL} from "../utils/urlUtils";
import "./SearchAutoComplete.css"

interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    description: string;
    on_sale: boolean;
    manufacturer: string;
    warranty: string;
    image: string;
}

const SearchAutoComplete: React.FC = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length > 1) {
                try {
                    const {data}: any = await axios.get(AUTOCOMPLETE_PRODUCTS_URL, {
                        params: {query},
                    });
                    setSuggestions(data.suggestions);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            } else {
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [query]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (product: Product) => {
        setQuery(product.name);
        setShowSuggestions(false);
        navigate(`/products/${product.id}`);
    };

    return (
        <div className="search-auto-complete">
            <Input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search for products..."
                onFocus={() => setShowSuggestions(true)}
            />

            {showSuggestions && suggestions.length > 0 && (
                <ListGroup className="suggestions-list">
                    {suggestions.map((product, index) => (
                        <ListGroupItem key={index} onClick={() => handleSuggestionClick(product)}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                {/* Product Image */}
                                <img
                                    src={IMAGES_BASE_URL + "/" + product.image}
                                    alt={product.name}
                                    style={{width: '50px', height: '50px', marginRight: '15px', objectFit: "contain"}}
                                />

                                {/* Product Info */}
                                <div>
                                    <strong style={{fontSize: '16px'}}>{product.name}</strong> {/* Product Name */}
                                    <div style={{fontSize: '14px', color: '#888'}}>
                                        ${product.price} {/* Product Price */}
                                    </div>
                                    <div style={{fontSize: '12px', color: '#aaa'}}>
                                        Manufacturer: {product.manufacturer} {/* Product Manufacturer */}
                                    </div>
                                </div>
                            </div>
                        </ListGroupItem>

                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default SearchAutoComplete;
