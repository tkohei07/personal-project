import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "./form/Input";

const EditBuilding = () => {
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [building, setBuilding] = useState({});
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [link, setLink] = useState("");
    const [isComputerRoom, setIsComputerRoom] = useState(false);
    const [isReservableStudyRoom, setIsReservableStudyRoom] = useState(false);
    const [isVendingArea, setIsVendingArea] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/building/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setBuilding(data);
                setName(data.name);
                setAddress(data.address);
                setLink(data.link);
                setIsComputerRoom(data.isComputerRoom);
                setIsReservableStudyRoom(data.isReservableStudyRoom);
                setIsVendingArea(data.isVendingArea);
            })
            .catch((err) => {
                console.log("error:", err);
            });
    }, [id]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        switch (name) {
            case "isComputerRoom":
                setIsComputerRoom(checked);
                break;
            case "isReservableStudyRoom":
                setIsReservableStudyRoom(checked);
                break;
            case "isVendingArea":
                setIsVendingArea(checked);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                address: address,
                link: link,
                isComputerRoom: isComputerRoom,
                isReservableStudyRoom: isReservableStudyRoom,
                isVendingArea: isVendingArea,
            }),
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/building/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(`Failed to edit building: ${data.error}`);
                } else {
                    navigate(`/`);
                }
            })
            .catch((err) => {
                console.log("error:", err);
            });
    };

    return (
        <div className="container">
            <h1>Edit Building</h1>
            <hr />
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <Input
                    title="Name"
                    type="text"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                />
                
                <Input
                    title="Address"
                    type="text"
                    className="form-control"
                    name="address"
                    value={address}
                    onChange={handleAddressChange}
                />

                <Input
                    title="Link"
                    type="text"
                    className="form-control"
                    name="link"
                    value={link}
                    onChange={handleLinkChange}
                />

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="isComputerRoom"
                        checked={isComputerRoom}
                        onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="isComputerRoom">
                        Computer Room
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="isReservableStudyRoom"
                        checked={isReservableStudyRoom}
                        onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="isReservableStudyRoom">
                        Reservable Study Room
                    </label>
                </div>

                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="isVendingArea"
                        checked={isVendingArea}
                        onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="isVendingArea">
                        Vending Area
                    </label>
                </div>
                
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default EditBuilding;
