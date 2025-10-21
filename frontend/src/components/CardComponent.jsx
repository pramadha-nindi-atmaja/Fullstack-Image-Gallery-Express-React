import axios from "axios";
import { Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { MdEdit, MdCancel } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

const CardComponent = ({ product, getProducts }) => {
  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(`/api/products/${id}`);
      toast.info(data.message || "Product deleted successfully.", {
        position: "top-center",
      });
      getProducts();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete product.";
      toast.error(message, { position: "top-center" });
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-body-tertiary p-4 rounded shadow text-center">
          <h4 className="mb-3">Are you sure?</h4>
          <p className="mb-4">Do you really want to delete this product?</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              <MdCancel className="me-1" /> Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteProduct(id);
                onClose();
              }}
            >
              <FaRegCheckCircle className="me-1" /> Yes, Delete
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <Col md={4} xs={6} className="mb-4">
      <Card className="shadow h-100">
        <Card.Img
          variant="top"
          src={product.url}
          alt={product.name}
          style={{ objectFit: "cover", height: 250 }}
        />
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title className="text-truncate">{product.name}</Card.Title>
          <div className="text-end mt-3">
            <Link
              to={`/edit/${product.id}`}
              className="btn btn-success me-2 d-inline-flex align-items-center"
            >
              <MdEdit className="me-1" /> Edit
            </Link>
            <Button
              variant="danger"
              onClick={() => confirmDelete(product.id)}
              className="d-inline-flex align-items-center"
            >
              <IoMdTrash className="me-1" /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

CardComponent.propTypes = {
  product: PropTypes.object.isRequired,
  getProducts: PropTypes.func.isRequired,
};

export default CardComponent;
