import { useCallback, useEffect, useState, useMemo } from "react";
import { Col, Row, Spinner, Alert, Form, InputGroup, Dropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdAdd, IoMdSearch, IoMdArrowDropdown } from "react-icons/io";
import CardComponent from "./CardComponent.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/products");
      if (data && Array.isArray(data.response)) {
        setProducts(data.response);
      } else {
        setProducts([]);
        toast.warn("Received unexpected data format from server", { position: "top-center" });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load products. Please try again later.";
      toast.error(message, { position: "top-center" });
      setProducts([]); // Set empty array on error to prevent infinite loading state
    } finally {
      setLoading(false);
    }
  }, []);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = products
      .map(product => product.category)
      .filter((cat, i, arr) => cat && arr.indexOf(cat) === i);
    return cats.sort();
  }, [products]);

  // Filter products based on search term and category
  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    return result;
  }, [products, searchTerm, selectedCategory]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className="container mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-semibold mb-0">Image Gallery</h4>
            <Link className="btn btn-success d-flex align-items-center" to="/add">
              <IoMdAdd className="me-2" /> Add New Image
            </Link>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="mb-4">
            <Row>
              <Col md={8} className="mb-3 mb-md-0">
                <InputGroup>
                  <InputGroup.Text>
                    <IoMdSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search images by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex justify-content-between align-items-center">
                    {selectedCategory || "All Categories"}
                    <IoMdArrowDropdown />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item onClick={() => setSelectedCategory("")}>
                      All Categories
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    {categories.map(category => (
                      <Dropdown.Item 
                        key={category} 
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </div>
          
          <hr className="mt-2 mb-4" />

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
              <p className="mt-3 text-muted">Loading images...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <Alert variant="info" className="text-center">
              No images found. Click <b>Add New Image</b> to upload one!
            </Alert>
          )}

          {/* Product Grid */}
          <Row>
            {filteredProducts.map((product) => (
              <CardComponent
                key={product.id}
                product={product}
                getProducts={getProducts}
              />
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProductList;
