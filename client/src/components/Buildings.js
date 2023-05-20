import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Buildings = () => {
    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/all-buildings`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setBuildings(data);
            })
            .catch(err => {
                console.log("err:", err);
            })

        }, []);

    const deleteBuilding = (id) => {
        if (!window.confirm("Are you sure you want to delete this building? This will also delete all related information.")) {
            return;
        }
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/buildings/${id}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete building.");
            }
            setBuildings(buildings.filter((building) => building.id !== id));
        })
        .catch((err) => {
            console.log("Error deleting building:", err);
        });
    };

    return(
        <div>
            <h2>Buildings</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Building</th>
                        <th>Address</th>
                        <th>Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {buildings && buildings.length > 0 ? (
                        buildings.map((m) => (
                            <tr key={m.id}>
                                <td>
                                    <Link to={m.link}>
                                        {m.name}
                                    </Link>
                                </td>
                                <td>{m.address}</td>
                                <td>
                                    <Link to={`/hours/${m.id}`}>
                                        more
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/buildings/edit/${m.id}`} className="btn btn-primary">
                                        Edit
                                    </Link>
                                    <button onClick={() => deleteBuilding(m.id)} className="btn btn-danger">
                                        Delete
                                    </button>
                                </td>
                            </tr>    
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">
                                <b>No buildings found.</b>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Buildings;