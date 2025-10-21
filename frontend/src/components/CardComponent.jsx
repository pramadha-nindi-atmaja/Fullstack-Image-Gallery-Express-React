import { useState } from "react";
import axios from "axios";
import { Col, Button, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { MdEdit, MdCancel } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

const CardComponent = ({ product, getProducts }) => {
  const [deleting, setDeleting] = useState(false);

  const deleteProduct = async (id) => {
    setDeleting(true);
    try {
      const { data } = await axios.delete(`/api/products/${id}`);
      toast.success(data.message || "Product deleted successfully.", {
        position: "top-center",
      });
      await getProducts();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete product.";
      toast.error(message, { position: "top-center" });
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-body-tertiary p-4 rounded shadow text-center animate__animated animate__fadeIn">
          <h4 className="mb-3 fw-semibold">Confirm Deletion</h4>
          <p className="mb-4 text-secondary">
            Are you sure you want to delete <b>{product.name}</b>?
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="outline-secondary" onClick={onClose}>
              <MdCancel className="me-1" /> Cancel
            </Button>
            <Button
              variant="danger"
              disabled={deleting}
              onClick={() => {
                deleteProduct(id);
                onClose();
              }}
            >
              {deleting ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                    role="status"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <FaRegCheckCircle className="me-1" /> Yes, Delete
                </>
              )}
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <Col md={4} xs={6} className="mb-4">
      <Card className="shadow h-100 border-0 rounded-4 overflow-hidden hover-shadow-sm transition-all">
        <div className="overflow-hidden">
          <Card.Img
            variant="top"
            src={product.url}
            alt={product.name}
            style={{
              objectFit: "cover",
              height: 250,
              transition: "transform 0.3s ease",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x250?text=No+Image";
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
        </div>
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title
            className="text-truncate mb-3 fw-semibold"
            title={product.name}
          >
            {product.name}
          </Card.Title>
          <div className="text-end mt-auto">
            <Link
              to={`/edit/${product.id}`}
              className="btn btn-success me-2 d-inline-flex align-items-center"
            >
              <MdEdit className="me-1" /> Edit
            </Link>
            <Button
              variant="danger"
              onClick={() => confirmDelete(product.id)}
              disabled={deleting}
              className="d-inline-flex align-items-center"
            >
              {deleting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <IoMdTrash className="me-1" /> Delete
                </>
              )}
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
