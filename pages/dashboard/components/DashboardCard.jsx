import { useState, useEffect } from "react";


const DashboardCard = ({averageAvailability, averagePerformance, averageQuality, averageOEE}) => {
 

  const data = [
    {
      title: "Average Availability",
      amount: parseFloat(averageAvailability),
    },
    {
      title: "Average Performance",
      amount: parseFloat(averagePerformance),
    },
    {
      title: "Average Quality",
      amount: parseFloat(averageQuality),
    },
    {
      title: "Average OEE",
      amount: parseFloat(averageOEE),
    }
  ];

  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-3 col-md-6">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between items-center">
              <div className="col-auto">
                <div className="fw-500 lh-14">{item.title}</div>
                <div className={`text-26 lh-16 fw-600 mt-5 ${item.amount > 70 ? 'text-green-2' : 'text-red-1'}`}>{item.amount}%</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
