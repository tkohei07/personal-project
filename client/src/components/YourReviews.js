import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useUser } from './../UserContext';

const UserReviews = () => {
    const [reviews, setReviews] = useState([]);
    const { userId } = useUser();

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/user/${userId}/reviews`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setReviews(data || []);
            })
            .catch(err => {
                console.log("err:", err);
            });
    }, [userId]);

    const deleteReview = (reviewId) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        };
    
        fetch(`${process.env.REACT_APP_BACKEND}/api/review/${reviewId}`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    // remove the deleted review from the state
                    setReviews(reviews.filter(review => review.id !== reviewId));
                } else {
                    console.log("Failed to delete review");
                }
            })
            .catch(err => {
                console.log("err:", err);
            });
    };

    return (
        <div>
            <h2>Your Reviews</h2>
            <hr />
            {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id}>
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
                        <p>Review for {review.buildingName}</p>
                        <p>{review.comment}</p>
                        <button onClick={() => deleteReview(review.id)}>Delete</button>
                        <br />
                    </div>
                ))
            ) : (
                <p>You haven't made any reviews yet.</p>
            )}

        </div>
    )
}

export default UserReviews;
