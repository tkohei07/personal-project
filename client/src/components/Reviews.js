import React, { useState, useEffect, startTransition } from 'react';
import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Reviews = () => {
    const { id } = useParams();
    const [buildingName, setBuildingName] = useState("");
    const [reviews, setReviews] = useState([]);

    // Fetch building name
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
                setBuildingName(data.name);
            })
            .catch((err) => {
                console.log("error:", err);
            });
    }, [id]);

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/reviews/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setReviews(data);
            })
            .catch(err => {
                console.log("Error:", err);
            })

        }, [id]);

    return (
        <div>
            <h2>Reviews for {buildingName}</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this building!</p>
            ) : (
                reviews.map(review => (
                    <div key={review.id}>
                        <h3>{review.username}</h3>
                        <div>
                            {[...Array(5)].map((star, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <label key={i}>
                                        <FaStar
                                            size={15}
                                            color={ratingValue <= review.rating ? "#ffc107" : "#e4e5e9"}
                                        />
                                    </label>
                                );
                            })}
                            <span style={{marginLeft: "15px", fontSize: "0.8em"}}>{new Date(review.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <p>{review.comment}</p>
                        <br />
                    </div>
                ))
            )}
            <Link to={`/add-review/${id}`}>Add Review</Link>
        </div>
    );
};

export default Reviews;
