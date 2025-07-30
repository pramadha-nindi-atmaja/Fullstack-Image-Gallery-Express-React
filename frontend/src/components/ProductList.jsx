import { Col, Row } from "react-bootstrap";
import CardComponent from "./CardComponent.jsx";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const getProducts = useCallback(async () => {
    try {
      const out = await axios.get("/api/products");
      setProducts(out.data.response);
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);
  return (
    <>
      <div className="container mt-3">
        <Row>
          <Col>
            <h4>Image Galery</h4>
            <hr />
            <Link className="btn btn-success mb-3" to="/add">
              <IoMdAdd /> Add New Image Galery
            </Link>
            <Row>
              {products &&
                products.map((product) => (
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
    </>
  );
};

export default ProductList;
