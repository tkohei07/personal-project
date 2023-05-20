import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const daysOfWeek = [
    { id: 0, label: "SUN" },
    { id: 1, label: "MON" },
    { id: 2, label: "TUE" },
    { id: 3, label: "WED" },
    { id: 4, label: "THU" },
    { id: 5, label: "FRI" },
    { id: 6, label: "SAT" },
  ];

const Hours = () => {
    const { id } = useParams();
    const [hours, setHours] = useState([]);

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(`${process.env.REACT_APP_BACKEND}/api/hours/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setHours(data);
            })
            .catch(err => {
                console.log("err:", err);
            })

    }, [id]);

    const deleteHours = (id) => {
        if (!window.confirm("Are you sure to delete the this hour?")) {
            return;
        }
        const requestOptions = {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json"
            },
        };
    
        fetch(`${process.env.REACT_APP_BACKEND}/api/hours/${id}`, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete hour.");
            }
            setHours(hours.filter((hour) => hour.id !== id));
        })
        .catch((err) => {
            console.log("Error deleting hour:", err);
        });
    }

    return(
        <div>
            <h2>Hours</h2>
            <hr />
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {hours.map((hour) => {
                        // convert date strings to Date objects
                        const startDate = new Date(hour.startDate);
                        const endDate = new Date(hour.endDate);

                        // Convert time strings to Date objects
                        const openTime = new Date(`1970-01-01T${hour.openTimeStr}Z`);
                        const closeTime = new Date(`1970-01-01T${hour.closeTimeStr}Z`);

                        // Convert time to 12-hour format
                        const openTimeStr = openTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                        const closeTimeStr = closeTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                        return (
                            <tr key={hour.id}>
                                <td>{startDate.toLocaleDateString()}-{endDate.toLocaleDateString()}</td>
                                <td>{daysOfWeek.find(day => day.id === hour.dayOfWeek)?.label}</td>
                                <td>{openTimeStr}-{closeTimeStr}</td>
                                <td>
                                    <button onClick={() => deleteHours(hour.id)} className="btn btn-danger">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                
            </table>
        </div>
    );
}

export default Hours;