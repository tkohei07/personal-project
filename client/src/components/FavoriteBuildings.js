import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import { useUser } from './../UserContext';

const FavoriteBuildings = () => {
    const [favorites, setFavorites] = useState([]);
    const { userId } = useUser();

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

    const handleRemoveFavorite = (buildingId) => {
        const requestOptions = {
            method: "DELETE",
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
                // If the response indicates success, remove the building from the local favorites state
                if (!data.error) {
                    setFavorites(favorites.filter(favorite => favorite.buildingId !== buildingId));
                } else {
                    console.log("Error removing favorite:", data.error);
                }
            })
            .catch((err) => {
                console.log("Error removing favorite:", err);
            });
    };

    return (
        <div>
            <h2>Favorite Buildings</h2>
            <hr />
            <ul>
                {favorites && favorites.length > 0 ? (
                    favorites.map((favorite) => (
                        <li key={favorite.buildingId}>
                            <Link to={`/building/${favorite.buildingId}`}>
                                {favorite.buildingName}
                            </Link>
                            <FaHeart onClick={() => handleRemoveFavorite(favorite.buildingId)} className="favorite-icon" />
                        </li>
                    ))
                ) : (
                    <p>No favorite buildings found.</p>
                )}
            </ul>
        </div>
    );
}

export default FavoriteBuildings;
