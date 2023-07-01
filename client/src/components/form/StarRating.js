import { FaStar } from "react-icons/fa";

const StarRating = ({ value, onChange }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div>
      {stars.map((star) => (
        <FaStar
          key={star}
          color={star <= value ? "orange" : "grey"}
          onClick={() => onChange(star)}
          aria-label={`star-${star}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
