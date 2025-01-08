import { useState, useEffect } from "react";
import getShifts from "../../../utils/getShifts";
const RercentShifts = () => {
  const [shifts, setShifts] = useState([]);

  useEffect(()=>{
    const fetchShifts =async()=>{
      const res = await getShifts();
      setShifts(res);
    }
    fetchShifts();
  },[setShifts]);

  return (
    <div className="overflow-scroll scroll-bar-1 pt-30">
      <table className="table-2 col-12">
        <thead>
          <tr>
            <th>Shift ID</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Ideal Rate</th>
            <th>Availability</th>
            <th>Performance</th>
            <th>Quality</th>
            <th>OEE</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {shifts?.map((row, index) => (
            <tr key={index}>
              <td>{row.id}</td>
              <td>{row.date}</td>
              <td className="fw-500">{row.start_time}</td>
              <td className="fw-500">{row.end_time}</td>
              <td>{row.ideal_rate}</td>
              <td>{row.availability}</td>
              <td>{row.performance}</td>
              <td>{row.quality}</td>
              <td>{row.oee}</td>
              <td>{row.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RercentShifts;
