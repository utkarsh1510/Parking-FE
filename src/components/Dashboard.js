import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { ParkingTickets } from "./Parkingticket";

const Dashboard = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        if(!localStorage.getItem("session_id")) {
           return navigate("/");
        }
        document.title="TPS 📍 Dashboard"
    }, [])
    return(
        <div>
            <Header />
            <ParkingTickets />
        </div>
    )
}

export default Dashboard;