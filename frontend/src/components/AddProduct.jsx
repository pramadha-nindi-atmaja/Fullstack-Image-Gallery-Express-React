import { useState } from "react";
import { Button, Col, Row, Form, Figure } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosSave } from "react-icons/io";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
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
    
    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(image.type)) {
      toast.error("Invalid file type. Please upload a JPEG, JPG, PNG, or GIF image.", {
        position: "top-center"
      });
      return;
    }
    
    // File size validation (5MB max)
    if (image.size > 5000000) {
      toast.error("File size exceeds 5MB limit", {
        position: "top-center"
      });
      return;
    }
    
    setFormData({
      ...formData,
      file: image
    });
    setPreview(URL.createObjectURL(image));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required", {
        position: "top-center"
      });
      return;
    }
    
    if (!formData.file) {
      toast.error("Image is required", {
        position: "top-center"
      });
      return;
    }
    
    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(formData.file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, JPG, PNG, or GIF image.", {
        position: "top-center"
      });
      return;
    }
    
    // File size validation (5MB max)
    if (formData.file.size > 5000000) {
      toast.error("File size exceeds 5MB limit", {
        position: "top-center"
      });
      return;
    }

    const data = new FormData();
    data.append("file", formData.file);
    data.append("name", formData.name.trim());
    if (formData.description.trim()) {
      data.append("description", formData.description.trim());
    }
    if (formData.category.trim()) {
      data.append("category", formData.category.trim());
    }
    
    try {
      const response = await axios.post("/api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data"
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

            <Form.Group as={Row} className="mb-3" controlId="productDescription">
              <Form.Label column sm="2">
                Description
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product Description (optional)"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="productCategory">
              <Form.Label column sm="2">
                Category
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Product Category (optional)"
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