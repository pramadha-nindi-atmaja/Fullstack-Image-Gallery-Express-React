import { useState } from "react";
import { Button, Col, Row, Form, Figure } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosSave } from "react-icons/io";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    file: null
  });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    if (!image) return;
    
    setFormData({
      ...formData,
      file: image
    });
    setPreview(URL.createObjectURL(image));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.file) {
      toast.error("Product name and image are required", {
        position: "top-center"
      });
      return;
    }

    const data = new FormData();
    data.append("file", formData.file);
    data.append("name", formData.name);
    
    try {
      const response = await axios.post("/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data" // Fixed typo from original code
        }
      });
      
      toast.success(response.data.message, {
        position: "top-center"
      });
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          "An error occurred while saving the product";
      toast.error(errorMessage, {
        position: "top-center"
      });
    }
  };

  return (
    <div className="container mt-3">
      <Row>
        <Col>
          <h4>Add Product</h4>
          <hr />
          <Form onSubmit={saveProduct}>
            <Form.Group as={Row} className="mb-3" controlId="productName">
              <Form.Label column sm="2">
                Product Name
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="productImage">
              <Form.Label column sm="2">
                Image
              </Form.Label>
              <Col sm="10">
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </Col>
            </Form.Group>

            {preview && (
              <Row>
                <Col md={{ span: 10, offset: 2 }}>
                  <Figure>
                    <Figure.Image
                      width={171}
                      height={180}
                      alt="Product preview"
                      src={preview}
                    />
                  </Figure>
                </Col>
              </Row>
            )}

            <Row>
              <Col md={{ span: 10, offset: 2 }}>
                <Button type="submit" variant="success">
                  <IoIosSave /> Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default AddProduct;