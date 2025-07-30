import { useCallback, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Figure from "react-bootstrap/Figure";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosSave } from "react-icons/io";

const EditProduct = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const getProductById = useCallback(async () => {
    try {
      const out = await axios.get(`/api/products/${id}`);
      setName(out.data.response.name);
      setFile(out.data.response.image);
      setPreview(out.data.response.url);
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  }, [id]);

  useEffect(() => {
    getProductById();
  }, [getProductById]);

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const editProduct = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("name", name);
    try {
      const out = await axios.put(`/api/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/from-data",
        },
      });
      toast.info(out.data.message, {
        position: "top-center",
      });
      navigate("/");
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <div className="container mt-3">
        <Row>
          <Col>
            <h4>Edit Product</h4>
            <hr />
            <form onSubmit={editProduct}>
              <Form.Group as={Row} className="mb-3" controlId="frmProductName">
                <Form.Label column sm="2">
                  Product Name
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="frmProductImage">
                <Form.Label column sm="2">
                  Image
                </Form.Label>
                <Col sm="10">
                  <Form.Control type="file" onChange={loadImage} />
                </Col>
              </Form.Group>

              <Row>
                <Col md={{ span: 10, offset: 2 }}>
                  {preview ? (
                    <Figure>
                      <Figure.Image
                        width={171}
                        height={180}
                        alt="preview image"
                        src={preview}
                      />
                    </Figure>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 10, offset: 2 }}>
                  <Button type="submit" variant="success">
                    <IoIosSave /> Update
                  </Button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EditProduct;
