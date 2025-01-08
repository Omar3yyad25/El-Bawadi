import { useState } from "react";

const ChartSelect = ({ onSelectStation }) => {
  const options = [
    {
      id: "h7dl0cac14b6gtf",
      name: "Station 1",
      
    },
    {
      id: "ntxzjl4mxf9fuuy",
      name: "Station 2",
      
    },
    {
      id: "lcis28ou94ir7t7",
      name: "Station 3",
      
    },
    {
      id: "b5wrd2zw4qwgvk5",
      name: "Station 4",
      
    },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleStationSelect = (option) => {
    setSelectedOption(option);
    onSelectStation(option.id); // Call the prop function to update the selected station
  };

  return (
    <div className="dropdown js-dropdown js-category-active">
      <div
        className="dropdown__button d-flex items-center bg-white border-light rounded-100 px-15 py-10 text-14 lh-12"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
        data-bs-offset="0,10"
      >
        <span className="js-dropdown-title">{selectedOption.name}</span>
        <i className="icon icon-chevron-sm-down text-7 ml-10" />
      </div>
      <div className="toggle-element -dropdown  dropdown-menu">
        <div className="text-14 y-gap-15 js-dropdown-list">
          {options.map((option, index) => (
            <div key={index}>
              <button
                className={`d-block js-dropdown-link ${
                  selectedOption === option.name ? "text-blue-1 " : ""
                }`}
                onClick={() => handleStationSelect(option)}
              >
                {option.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSelect;
