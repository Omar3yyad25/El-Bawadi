import DashboardCard from "./components/DashboardCard";
import Sidebar from "../common/Sidebar";
import Header from "../../components/header/dashboard-header";
import Form from "./components/Form";
import Footer from "../common/Footer";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getBreaks from "../../utils/getBreaks";

import getShifts from '../../utils/getShifts';
import { Button } from 'antd';

const Index = () => {
  const [shifts, setShifts] = useState([]);
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [breaks, setBreaks] = useState([]);
  const [isDuringBreak, setIsDuringBreak] = useState(false);
  const [emergencyOverride, setEmergencyOverride] = useState(false);
  const router = useRouter();

  console.log("breaks", breaks)
  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    if (role !== "operator") {
      router.push("/");
    }
  }, [router]);

  const fetchShiftsAndBreaks = async () => {
    const [shiftData, breakData] = await Promise.all([getShifts(), getBreaks(activeShiftId)]);
    setShifts(shiftData);
    setBreaks(breakData);
  };

  useEffect(() => {
    fetchShiftsAndBreaks();

    const intervalId = setInterval(fetchShiftsAndBreaks, 60000); // Poll every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkActiveShift = () => {
      const now = new Date();
      now.setHours(now.getHours() + 3); // Adjust for GMT+3
      const rnow = now.toISOString();
      const activeShift = shifts.find(shift => rnow >= new Date(shift.start_time).toISOString() && rnow <= new Date(shift.end_time).toISOString());
      if (activeShift) {
        setActiveShiftId(activeShift.id);
      } else {
        setActiveShiftId(null);
      }
    };

    checkActiveShift();
    const intervalId = setInterval(checkActiveShift, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [shifts]);

  useEffect(() => {
    const checkBreakTime = () => {
      const now = new Date();
      now.setHours(now.getHours() + 3); // Adjust for GMT+3
      const rnow = now.toISOString();
      const duringBreak = breaks.some(breakTime => rnow >= new Date(breakTime.start_time).toISOString() && rnow <= new Date(breakTime.end_time).toISOString());
      setIsDuringBreak(duringBreak);
    };

    checkBreakTime();
    const intervalId = setInterval(checkBreakTime, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [breaks]);

  const handleEmergencyClick = () => {
    setEmergencyOverride(true);
  };

  const renderContent = () => {
    if (isDuringBreak && !emergencyOverride) {
      return (
        <div className="row y-gap-30 pt-20 chart_responsive">
          <div className="col-12">
            <div className="py-30 px-30 rounded-4 bg-white shadow-3 text-center">
              <div className="text-26 lh-16 fw-600 mt-5">You are currently during a break</div>
              <Button type="primary" onClick={handleEmergencyClick} style={{marginTop:"30px"}}>Emergency</Button>
            </div>
          </div>
        </div>
      );
    }

    if (!activeShiftId) {
      return (
        <div className="row y-gap-30 pt-20 chart_responsive">
          <div className="col-12">
            <div className="py-30 px-30 rounded-4 bg-white shadow-3 text-center">
              <div className="text-26 lh-16 fw-600 mt-5">No active shift available</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <DashboardCard activeShiftId={activeShiftId} />
        <div className="row y-gap-30 pt-20 chart_responsive">
          <div className="col-xl-7 col-md-6">
            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              <div className="text-26 lh-16 fw-600 mt-5">After shift submission</div>
              <div className="pt-30">
                <Form activeShiftId={activeShiftId} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="header-margin"></div>
      <Header />
      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>
        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-6">
                <h1 className="text-30 lh-14 fw-600">Dashboard</h1>
                <div className="text-15 text-light-1">Operations section</div>
              </div>
              <div className="col-6">
                <div className="text-15 text-red-1">
                  {activeShiftId ? `Active shift: ${activeShiftId}` : "No shift available"}
                </div>
              </div>
            </div>
            {renderContent()}
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
