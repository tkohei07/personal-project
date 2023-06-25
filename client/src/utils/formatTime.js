export function formatTime(timeObj) {
    // Check if the input is an object with a valid time string
    if (typeof timeObj === 'object' && timeObj.Valid) {
      const timeStr = timeObj.String;
  
      // Split the time string into hours and minutes
      const [hours, minutes] = timeStr.split(":");
      const hoursInt = parseInt(hours, 10);
      const amPm = hoursInt >= 12 ? "pm" : "am";
      const formattedHours = hoursInt % 12 || 12;
      return `${formattedHours}:${minutes} ${amPm}`;
    } else {
      return "Closed";
    }
  }
  