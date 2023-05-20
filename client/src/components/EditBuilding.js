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
                link: link
            }),
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/building/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(`Failed to edit building: ${data.error}`);
                } else {
                    navigate(`/buildings/`);
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
            <button type="submit" className="btn btn-primary">
                Submit
            </button>
        </form>
    </div>
);
};

export default EditBuilding;


