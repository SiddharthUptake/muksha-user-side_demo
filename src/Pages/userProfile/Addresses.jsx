import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";
import {
  fetchUserProfile,
  editAddress,
  deleteAddress,
  createAddress,
} from "../../Redux-ToolKit/Slices/UserProfileSlice";
import userimg from "../../assets/images/person.jpeg";

function Addresses() {
  const user = useSelector((state) => state.userProfile.user);
  const [newAddress, setNewAddress] = useState({});
  const [addAddressModal, setAddAddressModal] = useState(false);
  const userid = user?._id;
  console.log(userid);
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const toggleModal = () => {
    setDeleteModal(!deleteModal);
  };

  const promptDelete = (addressId) => {
    setSelectedAddressId(addressId);
    toggleModal();
  };

  const toggleAddAddressModal = () => setAddAddressModal(!addAddressModal);

  const handleNewAddressChange = (key, value) => {
    setNewAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddAddress = () => {
    dispatch(createAddress(newAddress))
      .then(() => {
        toggleAddAddressModal();
        dispatch(fetchUserProfile());
      })
      .catch((error) => {
        console.error("Error adding address:", error);
      });
  };

  const confirmDelete = () => {
    console.log(user._id);
    dispatch(deleteAddress({ userID: userid, addressId: selectedAddressId }))
      .then(() => {
        dispatch(fetchUserProfile());
        toggleModal(); // Close the modal after deletion
      })
      .catch((error) => {
        console.error("Error deleting address:", error);
      });
  };

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editedAddress, setEditedAddress] = useState({});

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const startEdit = (addressId, address) => {
    setEditingAddressId(addressId);
    setEditedAddress(address);
  };

  const handleInputChange = (key, value) => {
    setEditedAddress((prev) => ({ ...prev, [key]: value }));
  };

  const saveEdit = (addressId) => {
    dispatch(editAddress({ addressId, address: editedAddress }))
      .then(() => {
        dispatch(fetchUserProfile()); // Refetch user data after editing the address
      })
      .catch((error) => {
        console.error("Error updating address:", error);
      });
    setEditingAddressId(null);
  };

  console.log(user?.addresses);

  return (
    <Container fluid className="personal-info-container">
      <div className="profile-header">
        <img src={userimg} alt="user" className="profile-pic" />
      </div>
      <hr />
      <Row>
        <Col lg="12">
          <h3 className="address-title">Addresses:</h3>
          {user?.addresses?.length >= 5 ? (
            <>
            <Button color="success" disabled>
              Add Address
            </Button>
              <h6 className="mt-3">Note : You can only add 5 Address</h6>
            </>
          ) : (
            <Button color="success" onClick={toggleAddAddressModal}>Add Address</Button>
          )}
          {user?.addresses?.map((address, index) => (
            <div
              key={index}
              className={`address-card ${address.main ? "main-address" : ""}`}
            >
              {editingAddressId === address._id ? (
                <>
                  <input
                    className="address-input"
                    value={editedAddress.houseBuildingName}
                    onChange={(e) =>
                      handleInputChange("houseBuildingName", e.target.value)
                    }
                    placeholder="House/Building Name"
                  />
                  <input
                    className="address-input"
                    value={editedAddress.streetName}
                    onChange={(e) =>
                      handleInputChange("streetName", e.target.value)
                    }
                    placeholder="Street Name"
                  />
                  <input
                    className="address-input"
                    value={editedAddress.landMark}
                    onChange={(e) =>
                      handleInputChange("landMark", e.target.value)
                    }
                    placeholder="Landmark"
                  />
                  <input
                    className="address-input"
                    value={editedAddress.cityDistrict}
                    onChange={(e) =>
                      handleInputChange("cityDistrict", e.target.value)
                    }
                    placeholder="City/District"
                  />
                  <input
                    className="address-input"
                    value={editedAddress.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="State"
                  />
                  <input
                    className="address-input"
                    value={editedAddress.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    placeholder="Postal Code"
                  />
                  <Button color="info" onClick={() => saveEdit(address._id)}>
                    Save
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => setEditingAddressId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <h6>House/Building: {address.houseBuildingName}</h6>
                  <h6>Street: {address.streetName}</h6>
                  <h6>Landmark: {address.landMark}</h6>
                  <h6>City/District: {address.cityDistrict}</h6>
                  <h6>State: {address.state}</h6>
                  <h6>Postal Code: {address.postalCode}</h6>
                  <h6>Contact no: {address.contactNumber}</h6>
                  <Button
                    color="primary"
                    onClick={() => startEdit(address._id, address)}
                  >
                    Edit Address
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => promptDelete(address._id)}
                  >
                    Remove
                  </Button>
                  {address?.main ? null : (
                    <Button color="success">Set Default Address</Button>
                  )}
                </>
              )}
            </div>
          ))}
        </Col>
      </Row>
       {/* Add address modal */}
       <Modal isOpen={addAddressModal} toggle={toggleAddAddressModal}>
        <ModalHeader toggle={toggleAddAddressModal}>Add New Address</ModalHeader>
        <ModalBody>
          <Label for="houseBuildingName">House/Building Name:</Label>
          <Input
            id="houseBuildingName"
            value={newAddress.houseBuildingName || ""}
            onChange={(e) => handleNewAddressChange("houseBuildingName", e.target.value)}
          />

          <Label for="streetName">Street Name:</Label>
          <Input
            id="streetName"
            value={newAddress.streetName || ""}
            onChange={(e) => handleNewAddressChange("streetName", e.target.value)}
          />

          <Label for="landMark">Landmark:</Label>
          <Input
            id="landMark"
            value={newAddress.landMark || ""}
            onChange={(e) => handleNewAddressChange("landMark", e.target.value)}
          />

          <Label for="postalCode">Postal Code:</Label>
          <Input
            id="postalCode"
            value={newAddress.postalCode || ""}
            onChange={(e) => handleNewAddressChange("postalCode", e.target.value)}
          />

          <Label for="cityDistrict">City/District:</Label>
          <Input
            id="cityDistrict"
            value={newAddress.cityDistrict || ""}
            onChange={(e) => handleNewAddressChange("cityDistrict", e.target.value)}
          />

          <Label for="state">State:</Label>
          <Input
            id="state"
            type="text"
            value={newAddress.state || ""}
            onChange={(e) => handleNewAddressChange("state", e.target.value)}
          />

          <Label for="contactNumber">Phone Number:</Label>
          <Input
            id="contactNumber"
            type="number"
            value={newAddress.contactNumber || ""}
            onChange={(e) => handleNewAddressChange("contactNumber", e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddAddress}>
            Add
          </Button>
          <Button color="secondary" onClick={toggleAddAddressModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {/* delete modal */}
      <Modal isOpen={deleteModal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Deletion</ModalHeader>
        <ModalBody>Are you sure you want to delete this address?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default Addresses;
