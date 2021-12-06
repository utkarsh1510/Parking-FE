import React, { useEffect } from "react"
import styled from "styled-components"
import QRCode from "react-qr-code";
import Modal from 'react-modal';
import { validate } from "../configs/utils";
import AxiosClient from '../configs/axios';
import * as moment from "moment";
import {Navigate, useNavigate} from "react-router-dom";
const customStyles = {
    content: {
      minWidth: "40%",
      maxHeight: "90vh",
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
    //   marginRight: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: "8px",
      overflowY: "auto"
    },
  };

  const customStylesReciept = {
    content: {
      minWidth: "25%", 
      maxWidth: "25%", 
      maxHeight: "90vh",
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
    //   marginRight: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: "8px",
      overflowY: "auto"
    },
  };

const TicketWrapper = styled.div`
    border: 1px dashed gray;
    border-left: ${({color}) => `6px solid ${color}`};
    min-height: 20px;
    border-radius: 2px;
    padding: 2px;
    text-align:center;
    cursor: pointer;
    
`

const ParaLabel = styled.p`
    font-size: 15px;
    color: #6d67ea;
`
const ParaLabel_Left = styled(ParaLabel)`
    text-align:left;
    padding-left: 2px
`

const Value = styled.b`
    font-size: 17px;
    color: #3028d3
`
const Value_WordBreak = styled(Value)`
    word-break: break-all;
    word-wrap: break-word !important;
`

export const ParkingTickets = () => {
    let navigate = useNavigate();
    const axiosClient = new AxiosClient();
    const [tickets, setTickets] = React.useState([]);
    const [modalIsOpen, setmodalIsOpen] = React.useState(false);
    const [billModalOpen, setBillModalOpen] = React.useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
    const [formValues, setFormValues] = React.useState({
        car_number: "",
        owner: "",
        contact: "",
        email: "", 
        initial_hours: 1
    })
    const [owner, setOwner] = React.useState();
    const [errors, setErrors] = React.useState({
        car_number: "",
        owner: "",
        contact: "",
        email: "",
        initial_hours: 1
    })

    useEffect((event) => {
        if(localStorage.getItem("session_id")) {
            getTicketList();
        }
    }, []);

    async function getTicketList() {
        try {
            let session_id = localStorage.getItem("session_id");
            let response = await axiosClient.getRequest('parking/parking-tickets', {session_id});
            let tickets = response.data.status ? response.data.data : []
            console.log(tickets);
            setTickets(tickets);
        } catch(err) {

        }
    }

    function openModal() {
        console.log('called here')
        resetValues();
        setmodalIsOpen(true);
    }  

    function closeModal() {
        setmodalIsOpen(false);
    }

    function openBillModal(index) {
        console.log('called here')
        // resetValues();
        console.log(tickets[index])
        setConfirmModalOpen(false)
        setBillModalOpen(true);
    }  

    function openConfirmModal() {
        setConfirmModalOpen(true);
    }

    function closeBillModal(isCloseTicketModal = false) {
        console.log('117')
        if(isCloseTicketModal) {
            setBillModalOpen(false);
        } else {
            console.log(121);
            setConfirmModalOpen(false)
        }
    }


    function handleChange(event) {
        let key = event.target.name;
        let value = event.target.value;
        if(key == "initial_hours") {
            if(Number(value) > 24) {
                value = 24;
            }
            value = Number(value)
        }
        setFormValues(prevValues => ({
            ...prevValues,
            [key]: value
        }));
        checkErrors();
    } 

    async function submitForm() {
        try {
            let isErrorsFound = checkErrors();
            if(!isErrorsFound) {
                let body = formValues;
                body.session_id = localStorage.getItem("session_id");
                let response = await axiosClient.postRequest('parking/create-ticket', body);
                if(response.data.status) {
                    //update Tickets
                    closeModal()
                    getTicketList()
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    function restrict(event) {
        if(event.target.value.length > 1) {
            event.preventDefault();
            return false;
        }
    }

    function checkErrors() {
        let EmailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
        let errorStatus = false, requiredErrors = {
            car_number: "",
            owner: "",
            contact: "",
            email: "",
            intial_hours: ""
        }
        if(!formValues.car_number.trim()) {
            requiredErrors.car_number = "Please enter the car number.";
        }

        if(!formValues.owner.trim()) {
            requiredErrors.owner = "Please enter the owner name.";
        }

        if(!formValues.contact.trim()) {
            requiredErrors.contact = "Please enter the owner's contact number";
        }

        if(formValues.contact && formValues.contact.length < 10) {
            requiredErrors.contact = "Please enter valid contact number";
        }

        if(!formValues.email.trim()) {
            requiredErrors.email = "Please enter the owner's email."
        } else if(formValues.email && !EmailRegEx.test(formValues.email)) {
            requiredErrors.email = "Please enter valid email address."
        }
        if(Object.values(requiredErrors).some(val => val.trim())) {
            errorStatus = true;
        }
        setErrors(requiredErrors);
        return errorStatus; 
    }

    function resetValues() {
        let values = {
            car_number: "",
            owner: "",
            contact: "",
            email: "",
            intial_hours: 1
        }
        setFormValues(values);
        setErrors(values);
    }


    

    return(
        <div className="row px-4">
            {/* Modal JSX */}
            <Modal ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal">
                <div className="d-flex justify-content-between">
                        <div className="">
                            <h4><img src={"img/logo.jpg"} height="60px" width="60px" />Create Parking Ticket</h4>
                        </div>
                        <div>
                            <span onClick={closeModal} className="modal-close fa fa-times"></span>
                        </div>
                </div>
                <hr className="bg-secondary text-secondary"/>
                <form>
                    <div className="form-group mb-4">
                        <label className="fw-bold mb-2">Car Number</label>
                        <input type="text" name="car_number" onKeyUp={handleChange} placeholder="Enter session owner name" className="form-control"/>
                        <p className="text-danger">{errors.car_number}</p>
                    </div>
                    <div className="form-group mb-4">
                        <label className="fw-bold mb-2">Owner Name</label>
                        <input type="text" name="owner" onChange={handleChange} placeholder="Enter session owner name" className="form-control"/>
                        <p className="text-danger">{errors.owner}</p>
                    </div>
                    <div className="form-group mb-4">
                        <label className="fw-bold mb-2">Owner Email</label>
                        <input type="text" name="email" onChange={handleChange} placeholder="Enter session owner name" className="form-control"/>
                        <p className="text-danger">{errors.email}</p>
                    </div>
                    <div className="form-group mb-4">
                        <label className="fw-bold mb-2">Owner Contact</label>
                        <input type="text" onKeyPress={validate} maxLength="10" name="contact" onChange={handleChange} placeholder="Enter session owner name" className="form-control"/>
                        <p className="text-danger">{errors.contact}</p>
                    </div>
                    <div className="form-group mb-4">
                        <label className="fw-bold mb-2">Parking Hour Span</label>
                        <input type="number" min="1" max="23" name="initial_hours" id="intial_hour" onKeyPress={validate && restrict} onChange={handleChange} placeholder="Enter session owner name" className="form-control"/>
                        <p className="text-danger">{errors.initial_hours}</p>
                    </div>
                </form>
                <div className="d-flex justify-content-end">
                    <div>
                        <button onClick={submitForm} className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </Modal>
            {/* Modal JSX ends */}

            <Modal ariaHideApp={false} isOpen={confirmModalOpen} style={customStyles}>
                <div className="d-flex justify-content-between">
                        <div className="">
                            <h4><img src={"img/logo.jpg"} height="60px" width="60px" />Confirm Generate Bill</h4>
                        </div>
                        <div>
                            <span onClick={() => {closeBillModal()}} className="modal-close fa fa-times"></span>
                        </div>
                </div>
                <p>Are you sure you want to continue generating bill for this ticket?</p>
                <div className="d-flex justify-content-end">
                    <div>
                        <button className="btn btn-light mx-2" onClick={() => {closeBillModal()}}>Cancel</button>
                        <button className="btn btn-primary" onClick={() => {openBillModal(0)}}>Confirm</button>
                    </div>
                </div>
            </Modal>

            {/* Bill Modal JSX */}
            <Modal ariaHideApp={false} isOpen={billModalOpen} style={customStylesReciept}>
                <div className="mx-auto">
                    <img src={"img/logo.jpg"} className="mx-auto d-block" height="60px" width="60px" /><br />
                    <h5 className="text-center mb-4 fw-bold">The <span className="text-info">P</span>arking SP📍T</h5>
                    <div className="border-top border-bottom no-xmargin">
                        <span className="text-center py-m-2 d-block">Parking Reciept</span>
                        <span className="text-center py-m-2 d-block">{moment().format("DD-MM-YYYY")}</span>
                    </div>
                    <div className="row border-bottom">
                        <div className="col-12 col-md-6 text-center">
                                <p><i class="fas fa-long-arrow-alt-right"></i>&nbsp;&nbsp;IN Time</p>
                                <p className="display-7 orbitron-font">02:56 PM</p>
                        </div>
                        <div className="col-12 col-md-6 text-center">
                                <p>OUT Time&nbsp;&nbsp;<i class="fas fa-long-arrow-alt-right"></i></p>
                                <p className="display-7 orbitron-font">04:26 PM</p>
                        </div>
                        <div className="col-12 col-md-6">
                            <p className="text-center">Amount To Pay : </p>
                        </div>
                        <div className="col-12 col-md-6">
                            <p className="text-center fw-bold">$243</p>
                        </div>
                    </div>
                    <p className="text-center my-4">Thanks for Trusting in US...</p>
                    <div className="d-flex justify-content-center">
                        <div>
                            <button className="btn btn-primary" onClick={() => {closeBillModal(true)}}>Done</button>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* Bill Modal JSX ends */}

            {/* Page JSX */}
            <div className="d-flex justify-content-between p-4 border-bottom container-fluid">
                <div>
                    <button className="btn btn-warning" onClick={openModal}>+ Add Ticket</button>
                </div>
                <div>
                Total Tickets: <b>{tickets.length}</b>
                </div>
            </div>
            {
                tickets.map((ele, index) => {
                    return (
                        <div className="col-12 col-md-3 p-4" key={index}>
                            <TicketWrapper color={"#3028d3"} className="col-12 p-2">
                                <div className="row">
                                    <div className="col-2 justify-content-center">
                                        <img src="img/logo.jpg" height="60px" width="60px"></img>
                                    </div>
                                    <div className="col-5">
                                        <ParaLabel>
                                            Parking Slot<br />
                                            <Value>
                                                {ele.slot}
                                            </Value>
                                        </ParaLabel>
                                    </div>
                                    <div className="col-5">
                                        <ParaLabel>
                                            Car Number<br />
                                            <Value>
                                            {ele.car_number}
                                            </Value>
                                        </ParaLabel>
                                    </div>

                                    <div className="col-8">
                                        <ParaLabel>
                                            IN time<br></br>
                                            <Value>
                                            <i className="fas fa-arrow-right"></i>&nbsp;&nbsp; {moment(ele.createdAt).format("hh:mm a")}
                                            </Value>
                                        </ParaLabel>
                                    </div>
                                    <div className="col-4">
                                        <QRCode size={70} value={ `Owner-${ele.owner}\nContact-${ele.owner_contact}\nEmail-${ele.owner_email}`} />
                                    </div>
                                    <div className="pl-2 mt-2 d-flex align-items-end col-12 col-md-7">
                                        <ParaLabel_Left>
                                            <small>Ref- #{`${ele._id}`}</small>
                                        </ParaLabel_Left>
                                    </div>
                                    <div className="pl-24 col-12 col-md-5 mt-2">
                                        <button onClick={openConfirmModal} className="btn btn-sm btn-outline-danger"><small>Generate Bill</small></button>
                                    </div>
                                </div>
                            </TicketWrapper>
                        </div>
                    )
                })
            }
        </div>
        
    )
}