import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const SearchBarDiv = styled.div`
    min-width: 40%;
`
export const Header = () => {
    const navigate = useNavigate();
    function endSession() {
        localStorage.removeItem("session_id");
        navigate("/");
    }
    return (
        <div className="px-4 py-2 bg-primary">
            <div className="d-flex justify-content-between">
                <div className="pt-2">
                    <span className="pt-4 text-light h3 font-family-josefin">The <span className="text-info">P</span>arking SP📍T</span>
                </div>
                <SearchBarDiv className="pt-1">
                    <input type="text" className="form-control" placeholder="Enter text to search"/>
                </SearchBarDiv>
                <div className="pt-1">
                    <button className="btn btn-danger" onClick={endSession}>End Session</button>
                </div>
            </div>
        </div>
    )
}