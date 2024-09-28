import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductItem from '../components/ProductItem/ProductItem';
import { FILTER_PRODUCTS_URL, IMAGES_BASE_URL } from '../utils/urlUtils';

const FilteredProductsPage = ({filterType}: {filterType: string}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch products based on the filter type
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const response:any = await axios.get(FILTER_PRODUCTS_URL, {
          params: { filter: filterType },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [filterType]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>{filterType === 'most-reviewed' ? 'Most Reviewed Products' : filterType === 'top-rated' ? 'Top Rated Products' : 'Trending Products'}</h1>
      <Row>
        {products.map((product:any, index) => (
          <Col lg="3" sm="6" key={index} style={{ marginBottom: '10px' }}>
            <ProductItem
                    name={product.name}
                    price={product.price}
                    description={product.description}
                    onViewClick={() => navigate("/products/" + product.id)}
                    id={product.id}
                    imageUrl={IMAGES_BASE_URL + "/" + product.image}
                    manufacturer={product.manufacturer} category={''} image={''} manufacturer_rebate={0} on_sale={0} retailer_discount={0} warranty={0}            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FilteredProductsPage;
