import { Button, Modal, Radio, Space, message } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import submitMalufunction from '../../../utils/submitMalufunction';

const data = [
  {
    id: "h7dl0cac14b6gtf",
    name: "Station 1",
    description: "Reason for malfunction at Station 1...",
    malfunctions: [
      "Mechanical failure in filling machine",
      "Electrical failure in filling machine",
      "Lack of raw materials (honey/tahini)",
      "Lack of raw materials (packaging materials)"
    ]
  },
  {
    id: "ntxzjl4mxf9fuuy",
    name: "Station 2",
    description: "Reason for malfunction at Station 2...",
    malfunctions: [
      "Spillage/Cleaning"
    ]
  },
  {
    id: "lcis28ou94ir7t7",
    name: "Station 3",
    description: "Reason for malfunction at Station 3...",
    malfunctions: [
      "Mechanical failure in safety shrink machine",
      "Electrical failure in safety shrink machine",
      "Roll change"
    ]
  },
  {
    id: "b5wrd2zw4qwgvk5",
    name: "Station 4",
    description: "Reason for malfunction at Station 4...",
    malfunctions: [
      "Lack of packaging materials",
      "Technical failure"
    ]
  },
];

const DashboardCard = ({ activeShiftId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedMalfunction, setSelectedMalfunction] = useState(null);
  const [reportedTime, setReportedTime] = useState(null);

  const showModal = (station) => {
    const time = new Date();
    time.setHours(time.getHours() + 3); // Adjust for GMT+3
    setReportedTime(time.toISOString());
    setSelectedStation(station);
    setSelectedMalfunction(null); // Reset the selected malfunction
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const time = new Date();
    time.setHours(time.getHours() + 3); // Adjust for GMT+3
    const resolvedTime = time.toISOString();

    setIsModalOpen(false);
    submitMalfunction(resolvedTime);
  };

  const submitMalfunction = (resolvedTime) => {
    message.loading("Submitting malfunction...", 3).then(() => {
      const submitRes = submitMalufunction(selectedStation.id, activeShiftId, reportedTime, resolvedTime, selectedMalfunction);
      if(submitRes){
        message.success("Malfunction submitted successfully");
      }
      else{
        message.error("Failed to submit malfunction");
      }
    });
    
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStation(null);
    setSelectedMalfunction(null); // Reset the selected malfunction
  };

  const onChange = (e) => {
    setSelectedMalfunction(e.target.value);
  };

  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-3 col-md-6">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between items-center">
              <div className="col-auto">
                <div className="text-26 lh-16 fw-600 mt-5">{item.name}</div>
              </div>
              <div className="col-auto">
                <Button
                  type="primary"
                  shape="round"
                  icon={<ToolOutlined />}
                  size={"large"}
                  onClick={() => showModal(item)}
                  style={{ backgroundColor: '#428D40', borderColor: '#428D40' }} // Change button color to red
                >
                  Fix now
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Modal
        title={selectedStation ? `Reason of malfunction for ${selectedStation.name}` : "Reason of malfunction"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !selectedMalfunction }} // Disable OK button if no malfunction selected
      >
        {selectedStation && (
          <>
            <Radio.Group onChange={onChange} value={selectedMalfunction}>
              <Space direction="vertical">
                {selectedStation.malfunctions.map((malfunction, index) => (
                  <Radio key={index} value={malfunction}>{malfunction}</Radio>
                ))}
              </Space>
            </Radio.Group>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DashboardCard;
