import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from './../UserContext';
import StarRating from "./form/StarRating";

const AddReview = () => {
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [buildingName, setBuildingName] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const { userId } = useUser();

    const navigate = useNavigate();

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

    const handleRatingChange = (starValue) => {
        setRating(starValue);
    };    

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                buildingId: id,
                userId: userId,
                rating: rating,
                comment: comment,
            }),
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/add-review/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    navigate(`/reviews/${id}`);
                }
            })
            .catch((err) => {
                console.log("error:", err);
            });

    };

    return (
        <div className="container">
            <h1>Review {buildingName}</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <StarRating
                        value={rating}
                        onChange={handleRatingChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">
                        Comment:
                    </label>
                    <textarea
                        id="comment"
                        className="form-control"
                        value={comment}
                        onChange={handleCommentChange}
                    />
                </div>

                {/* {error && <div className="alert alert-danger">{error}</div>} */}
                {error && <div className="alert alert-danger">{error} - UserId: {userId}</div>}
                <button type="submit" className="btn btn-primary">
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default AddReview;