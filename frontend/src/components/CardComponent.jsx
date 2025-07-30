import axios from "axios";
import { Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { confirmAlert } from "react-confirm-alert";
import { MdCancel } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

const CardComponent = ({ product, getProducts }) => {
  const deleteProduct = async (id) => {
    try {
      const out = await axios.delete(`/api/products/${id}`);
      getProducts();
      toast.info(out.data.message, {
        position: "top-center",
      });
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  };

  const confirmDel = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-body-tertiary p-5 rounded shadow">
            <h1>Are you sure?</h1>
            <p>You want to delete this file?</p>
            <div className="text-center">
              <button className="btn btn-danger me-2" onClick={onClose}>
                <MdCancel /> No
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  deleteProduct(id), onClose();
                }}
              >
                <FaRegCheckCircle /> Yes
              </button>
            </div>
          </div>
        );
      },
    });
  };
  return (
    <Col md={4} xs={6} className="mb-4">
      <Card className="shadow">
        <Card.Img width={"100%"} height={250} variant="top" src={product.url} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <div className="text-end">
            <Link to={`/edit/${product.id}`} className="btn btn-success me-2">
              <MdEdit /> Edit
            </Link>
            <Button onClick={() => confirmDel(product.id)} variant="danger">
              <IoMdTrash /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

CardComponent.propTypes = {
  product: PropTypes.object,
  getProducts: PropTypes.func,
};

export default CardComponent;
