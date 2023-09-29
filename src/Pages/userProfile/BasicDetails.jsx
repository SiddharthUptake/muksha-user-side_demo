import React, { useEffect, useState } from 'react';
import "../../Styles/profile.css";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, editUserProfile } from '../../Redux-ToolKit/Slices/UserProfileSlice';
import { Col, Container, Row, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label , Form , FormGroup  } from 'reactstrap';
import userimg from "../../assets/images/person.jpeg";

function BasicDetails() {
    const [modal, setModal] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState()

    const user = useSelector((state) => state.userProfile.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
        }
    }, [user]);

    useEffect(() => {
      dispatch(fetchUserProfile());
    }, [dispatch]);

    const toggle = () => setModal(!modal);

    const handleEditProfile = async () => {
        try {
            await dispatch(editUserProfile({ firstName, lastName , gender }));
            toggle(); // Close the modal after editing
        } catch (error) {
            console.log(error);
        }
    };

    if (!user) return <div>Loading...</div>;
    return (
        <Container fluid className="personal-info-container">
            <div className="profile-header">
                <img src={userimg} alt="user" className="profile-pic" />
                <button className="edit-btn" onClick={toggle}>Edit Personal Details</button>
            </div>
            <hr />
          

            <Row className="user-details mt-4">
                <Col lg="6">
                    <h3>First Name: <span>{user.firstName}</span></h3> 
                    <h3>Email: <span>{user.email}</span></h3> 
                    <h3>Password: <span>*****</span></h3> 
                </Col>
                <Col lg="6">
                    <h3>Last Name: <span>{user.lastName}</span></h3> 
                    <h3>Gender: <span>{user.gender}</span></h3> 
                </Col>
            </Row>

         
              {/* on edit Modal */}
              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Edit Personal Details</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="firstName" sm={2}>First Name:</Label>
                            <Col sm={10}>
                                <Input type="text" name="firstName" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="lastName" sm={2}>Last Name:</Label>
                            <Col sm={10}>
                                <Input type="text" name="lastName" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="gender" sm={2}>Gender:</Label>
                            <Col sm={10}>
                                <Input type="select" name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Input>
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleEditProfile}>Save</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </Container>
    )
}

export default BasicDetails;
