import { useCallback, useEffect, useState } from "react";
import { Col, Row, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import CardComponent from "./CardComponent.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data.response || []);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load products.";
      toast.error(message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }, []);

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
            {products.map((product) => (
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
