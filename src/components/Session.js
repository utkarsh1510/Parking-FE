import React from "react";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import AxiosClient from "../configs/axios";
import {useNavigate} from "react-router-dom";
const customStyles = {
  content: {
    minWidth: "40%",
    maxHeight: "70vh",
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: "8px",
    overflowY: "auto"
  },
};

const Session = () => {
    const navigate = useNavigate();
    const axiosClient = new AxiosClient();
    const [modalIsOpen, setIsOpen] = React.useState(false);
    let [owner, setOwner] = React.useState("");
    let [fare, setFare] = React.useState(0);
    let [slot, setSlot] = React.useState(0);
    let [errors, setErrors] = React.useState({
        owner: "",
        fare: "",
        slot: ""
    })
    // const Errors = 
    function openModal() {
        resetFormErrors(true, true);
        setIsOpen(true);
    }

    React.useEffect(() => {
        if(localStorage.getItem("session_id")) {
            navigate("/dashboard")
        }
        document.title= "TPS 📍 Home"
    }, [])

    

    function closeModal() {
        setIsOpen(false);
    }

    function resetFormErrors(isClearValues, isClearErrors) {
        if(isClearValues) {
            setFare("");
            setSlot("");
            setOwner("");
        }
        if(isClearErrors) {
            setErrors({
                owner: "",
                fare: "",
                slot: ""
            })
        }
    }

    async function submitForm() {
        resetFormErrors(false, true)
        console.log(owner)
        if(!owner || !owner.trim()) {
            console.log('set owner error')
            setErrors(prevValues => ({
                ...prevValues,
                owner: "Please enter the session owner name."
            }))
        }
        if(!slot || !slot.trim()) {
            setErrors(prevValues => ({
                ...prevValues,
                slot: "Please enter the maximum parking slots of the session."
            }))
        }
        console.log('fare here --->', fare)
        if(!fare || !fare.trim()) {
            setErrors(prevValues => ({
                ...prevValues,
                fare: "Please enter the fare per hour for the session."
            }))
        }
        console.log(Object.values(errors))
        setTimeout(async () => {
            console.log('callback recieved');
            if(Object.values(errors).every(val => !val.trim())) {
                let response = await axiosClient.postRequest('sessions/create-session', {name: owner, fare, max_slots: slot});
                if(response.data && response.data.status && response.data.data.session_id) {
                    let data = response?.data.data;
                    localStorage.setItem('session_id',data.session_id);

                }
            }
        }, 3000)
        
    }
    return(
        <div className="home-wrapper container-fluid video-cover">
            <video id="myVideo" autoPlay muted loop>
                <source src="video/bg.mp4" type="video/mp4" />
            </video>
            <Modal ariaHideApp={false} isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal">
                <div className="d-flex justify-content-between">
                        <div className="">
                            <h4>Create Session</h4>
                        </div>
                        <div>
                            <span onClick={closeModal} className="modal-close fa fa-times"></span>
                        </div>
                </div>
                <hr className="bg-secondary text-secondary"/>
                <form>
                    <div className="form-group mb-4">
                        <label className="fw-bold mb-2">Session Owner Name</label>
                        <input type="text" onChange={(event) => setOwner(event.target.value)} placeholder="Enter session owner name" className="form-control"/>
                        <p className="text-danger">{errors.owner}</p>
                    </div>
                    <div className="form-group mb-4">
                        <label className="fw-bold mb-2">Fare $ (per hour)</label>
                        <input type="number" onChange={(event) => setFare(event.target.value)} placeholder="Enter fare" className="form-control"/>
                        <p className="text-danger">{errors.fare}</p>
                    </div>
                    <div className="form-group mb-4">
                        <label className=" fw-bold mb-2">Maximum slots</label>
                        <input type="number" onChange={(event) => setSlot(event.target.value)} placeholder="Enter no.of slots" className="form-control"/>
                        <p className="text-danger">{errors.slot}</p>
                    </div>
                    </form>
                    <div className="d-flex justify-content-end">
                        <div>
                            <button onClick={submitForm} className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                
            </Modal>
            <div className="content">
                <div className="text-center">
                    <h1>The <span className="text-primary p-ini">P</span>arking <span className="text-warning">SP📍T</span></h1> 
                    {/* <img src={"img/logo.jpg"} height="70px" width="70px"/></h1> */}
                    <button onClick={openModal} className="btn btn-lg btn-warning">Get Started&nbsp;&nbsp;&nbsp;&rarr;</button>
                </div>
            </div>
        </div>
    )
}

export default Session;