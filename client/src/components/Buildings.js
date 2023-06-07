import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useUser } from './../UserContext';

const Buildings = () => {
    const [buildings, setBuildings] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const { userId } = useUser();

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
    
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };
    
        fetch(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setFavorites(data || []);
            })
            .catch(err => {
                console.log("err:", err);
            });
    
    }, [userId]);

    // Send a request to add or remove the building from the user's favorites.
    const handleFavorite = (buildingId) => {
        const favoritesIds = favorites ? favorites.map(favorite => favorite.buildingId) : [];
        const requestOptions = {
            method: favoritesIds.includes(buildingId) ? "DELETE" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                buildingId: buildingId,
            }),
        };
    
        fetch(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/favorites`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                // Update the local state based on the response
                if (data.error) {
                    console.log("Error changing favorite:", data.error);
                } else {
                    if (favoritesIds.includes(buildingId)) {
                        setFavorites(favorites.filter(favorite => favorite.buildingId !== buildingId));
                    } else {
                        setFavorites([...favorites, { userId: userId, buildingId: buildingId }]);
                    }
                }
            })
            .catch((err) => {
                console.log("Error changing favorite:", err);
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
                                <td>
                                    <button onClick={() => handleFavorite(m.id)} className="btn">
                                        {favorites && favorites.some(favorite => favorite.buildingId === m.id) ? <FaHeart /> : <FaRegHeart />}
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
