import DashboardCard from "./components/DashboardCard";
import Sidebar from "../common/Sidebar";
import Header from "../../components/header/dashboard-header";
import ChartSelect from "./components/ChartSelect";
import ChartMain from "./components/ChartMain";
import Link from "next/link";
import RercentShifts from "./components/RercentShifts";
import Footer from "../common/Footer";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Modal, DatePicker, Divider, TimePicker, InputNumber, Table, message } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import submitShift from "../../utils/submitShift";
import submitBreaks from "../../utils/submitBreaks";
import getShifts from "../../utils/getShifts";
import getMalufunctions from "../../utils/getMalufunctions";
import getShiftSubmission from "../../utils/getShiftSubmission";
import updateShift from "../../utils/updateShifts";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const columns = (handleDelete) => [
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    flex: 1,
  },
  {
    title: 'End Time',
    dataIndex: 'endTime',
    key: 'endTime',
    flex: 1,
  },
  {
    title: 'Action',
    key: 'action',
    flex: 1,
    render: (text, record) => (
      <Button danger onClick={() => handleDelete(record.key)}>Delete</Button>
    ),
  },
];

const Index = () => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState();
  const [open, setOpen] = useState(false);
  const [formBreak] = Form.useForm();
  const [formBreakValues, setFormBreakValues] = useState();
  const [openBreak, setOpenBreak] = useState(false);
  const [breaksData, setBreaksData] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [malfunctions, setMalfunctions] = useState([]);
  const [shiftSubmissions, setShiftSubmissions] = useState([]); // [shift_id, production_count, shift_id, production_count, ...
  const [averageAvailability, setAverageAvailability] = useState(0);
  const [averagePerformance, setAveragePerformance] = useState(0);
  const [averageQuality, setAverageQuality] = useState(0);
  const [averageOEE, setAverageOEE] = useState(0);
  const [selectStation,onSelectStation] = useState("Station 1");
  useEffect(() => {
    getShifts().then((shifts) => {
      setShifts(shifts);
    });
    getMalufunctions().then((malfunctions) => {
      setMalfunctions(malfunctions);
    });
    getShiftSubmission().then((shiftSubmission) => {
      setShiftSubmissions(shiftSubmission);
    });
  }, []);

  const getDowntime = (shift) => {
    const shiftMalfunctions = malfunctions.filter(
      (malfunction) => malfunction.shift === shift.id
    );
    return shiftMalfunctions.reduce((acc, malfunction) => {
      const resolvedTime = new Date(malfunction.resolved_time);
      const reportedTime = new Date(malfunction.reported_time);
      return acc + (resolvedTime - reportedTime) / 60000;
    }, 0);
  };

  const calculateAvailability = (shift) => {
    const start = new Date(shift.start_time);
    const end = new Date(shift.end_time);
    const scheduledShiftTime = (end - start) / 60000; // Calculate scheduled shift time in minutes
    const totalDowntime = getDowntime(shift);
    const availability = ((scheduledShiftTime - totalDowntime) / scheduledShiftTime) * 100;
    return availability;
  };

  const getSubmission = (shift) => {
    const shiftSubmission = shiftSubmissions.find((submission) => submission.shift === shift.id);
    return shiftSubmission;
  };

  const calculatePerformance = (shift) => {
    const shiftSubmission = getSubmission(shift);
    if (!shiftSubmission) {
      return 0; // No submission found, so performance is 0
    }

    const start = new Date(shift.start_time);
    const end = new Date(shift.end_time);
    const scheduledShiftTime = (end - start) / 60000; // Calculate scheduled shift time in minutes
    const performance = (shiftSubmission.production_count * 10 / (shift.ideal_rate * scheduledShiftTime)) * 100;
    return performance;
  };

  const calculateQuality = (shift) => {
    const shiftSubmission = getSubmission(shift);
    if (!shiftSubmission || shiftSubmission.production_count === 0) {
      return 0; // No submission or production count is zero, so quality is 0
    }
  
    const quality = ((shiftSubmission.production_count * 10 - (shiftSubmission.production_waste)) / (shiftSubmission.production_count)) * 100;
    return quality;
  };
  

  const calculateOEE = (shift) => {
    const availability = calculateAvailability(shift);
    const performance = calculatePerformance(shift);
    const quality = calculateQuality(shift);
    
    const oee = (availability * performance * quality) / 10000;
    return oee;
  };
  
  useEffect(() => {
    if (shifts.length > 0 && malfunctions.length > 0 && shiftSubmissions.length > 0) {
      // Calculate average availability
      const validAvailabilityShifts = shifts.filter(shift => calculateAvailability(shift) !== 0);
      const totalAvailability = validAvailabilityShifts.reduce((acc, shift) => {
        const availability = calculateAvailability(shift);
        updateShift(shift.id, { availability });
        return acc + availability;
      }, 0);
      const avgAvailability = validAvailabilityShifts.length > 0 ? totalAvailability / validAvailabilityShifts.length : 0;
      setAverageAvailability(avgAvailability.toFixed(2)); // Set to 2 decimal places
  
      // Calculate average performance
      const validPerformanceShifts = shifts.filter(shift => calculatePerformance(shift) !== 0);
      const totalPerformance = validPerformanceShifts.reduce((acc, shift) => {
        const performance = calculatePerformance(shift);
        updateShift(shift.id, { performance });
        return acc + performance;
      }, 0);
      const avgPerformance = validPerformanceShifts.length > 0 ? totalPerformance / validPerformanceShifts.length : 0;
      setAveragePerformance(avgPerformance.toFixed(2)); // Set to 2 decimal places
  
      // Calculate average quality
      const validQualityShifts = shifts.filter(shift => calculateQuality(shift) !== 0);
      const totalQuality = validQualityShifts.reduce((acc, shift) => {
        const quality = calculateQuality(shift);
        updateShift(shift.id, { quality });
        return acc + quality;
      }, 0);
      const avgQuality = validQualityShifts.length > 0 ? totalQuality / validQualityShifts.length : 0;
      setAverageQuality(avgQuality.toFixed(2)); // Set to 2 decimal places
  
      // Calculate average OEE
      const validOEEShifts = shifts.filter(shift => calculateOEE(shift) !== 0);
      const totalOEE = validOEEShifts.reduce((acc, shift) => {
        const oee = calculateOEE(shift);
        updateShift(shift.id, { oee });
        return acc + oee;
      }, 0);
      const avgOEE = validOEEShifts.length > 0 ? totalOEE / validOEEShifts.length : 0;
      setAverageOEE(avgOEE.toFixed(2)); // Set to 2 decimal places
    }
  }, [shifts, malfunctions, shiftSubmissions]);
  const onCreate = async (values) => {
    console.log('Received values of form: ', values);

    const startDateTime = dayjs(`${values.date.format('YYYY-MM-DD')}T${values.startTime.format('HH:mm:ss')}`).utc().add(3, 'hour').format();
    const endDateTime = dayjs(`${values.date.format('YYYY-MM-DD')}T${values.endTime.format('HH:mm:ss')}`).utc().add(3, 'hour').format();
    const shiftData = {
      date: values.date.format('YYYY-MM-DD'),
      start_time: startDateTime,
      end_time: endDateTime,
      ideal_rate: values.idealRate,
    };

    const newShiftId = await submitShift(shiftData);
    form.resetFields();
    for (let i = 0; i < breaksData.length; i++) {
      const breakItem = breaksData[i];
      const breakData = {
        start_time: dayjs(`${values.date.format('YYYY-MM-DD')}T${breakItem.startTime}`).utc().add(3, 'hour').format(),
        end_time: dayjs(`${values.date.format('YYYY-MM-DD')}T${breakItem.endTime}`).utc().add(3, 'hour').format(),
        shift: newShiftId.id, // Assign the new shift ID to each break
      };
      
      // Assuming submitBreak is a function to handle break submission
      setTimeout(async () => {
        await submitBreaks(breakData);
      }, 1500);
    }
    // display success message
    message.success('Shift created successfully');

    setShifts([...shifts, { ...shiftData, id: newShiftId }]);
    setBreaksData([]);
    setFormValues(values);
    setOpen(false);
    // refresh the page
    //window.location.reload();
  };

  const onCreateBreak = (values) => {
    console.log('Received values of form: ', values);
    formBreak.resetFields();

    setBreaksData([...breaksData, {
      key: breaksData.length + 1,
      startTime: values.startTime.format('HH:mm:ss'),
      endTime: values.endTime.format('HH:mm:ss'),
    }]);
    
    setOpenBreak(false);
  };

  const handleDelete = (key) => {
    const newData = breaksData.filter(item => item.key !== key);
    setBreaksData(newData);
  };

  const onChange = (time, timeString) => {
    console.log(time, timeString);
  };

  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    if (role !== "planner") {
      router.push("/");
    } else {
      if (token === undefined) {
        router.push("/");
      }
    }
  }, [router]);

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
              <div className="col-12">
                <h1 className="text-30 lh-14 fw-600">Dashboard</h1>
                <div className="text-15 text-light-1">Planning section</div>
              </div>
            </div>

            <DashboardCard averageAvailability={averageAvailability} averagePerformance={averagePerformance} averageQuality={averageQuality} averageOEE={averageOEE} />

            <div className="row y-gap-30 pt-20 chart_responsive">
              <div className="col-xl-7 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">Malfunctions Statistics</h2>
                    <ChartSelect onSelectStation={onSelectStation}/>
                  </div>

                  <div className="pt-30">
                    <ChartMain malfunctions={malfunctions} shifts={shifts} selectedStation={selectStation}/>
                  </div>
                </div>
              </div>

              <div className="col-xl-5 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">Recent Shifts</h2>
                    <Button type="primary" style={{backgroundColor:"#428D40"}} onClick={() => setOpen(true)}>
                      <h4 className="text-18 lh-1 fw-500">Add Shift</h4>
                    </Button>
                  </div>

                  <RercentShifts shifts={shifts} />
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>

      <Modal
        open={open}
        title="Add Shift & Add Breaks"
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{
          autoFocus: true,
          htmlType: 'submit',
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{
              modifier: 'public',
            }}
            clearOnDestroy
            onFinish={onCreate}
          >
            {dom}
          </Form>
        )}
      >
        <Divider>Shift Details</Divider>
        <Form.Item name="date" label="Date" style={{ marginTop: "10px" }}>
          <DatePicker placeholder="Shift Date" variant="filled" />
        </Form.Item>
        <Form.Item name="startTime" label="Start Time" style={{ marginTop: "10px" }}>
          <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
        </Form.Item>
        <Form.Item name="endTime" label="End Time" style={{ marginTop: "10px" }}>
          <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
        </Form.Item>
        <Divider>Breaks</Divider>
        <Form.Item name="Breaks" style={{ marginTop: "10px" }}>
          <Button type="primary" onClick={() => setOpenBreak(true)}>Add Breaks</Button>
        </Form.Item>
        <Table
          columns={columns(handleDelete)}
          dataSource={breaksData}
          pagination={false}
        />
        <Divider>More Info</Divider>
        <Form.Item name="idealRate" label="Ideal Rate" noStyle>
          <span className="ant-form-text" style={{ marginLeft: 8 }}>Ideal Rate</span>
          <Form.Item name="idealRate" noStyle>
            <InputNumber min={1} max={200} />
          </Form.Item>
        </Form.Item>
      </Modal>

      <Modal
        open={openBreak}
        title="Add Breaks"
        okText="Add"
        cancelText="Cancel"
        okButtonProps={{
          autoFocus: true,
          htmlType: 'submit',
        }}
        onCancel={() => setOpenBreak(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={formBreak}
            name="form_in_modal"
            initialValues={{
              modifier: 'public',
            }}
            clearOnDestroy
            onFinish={onCreateBreak}
          >
            {dom}
          </Form>
        )}
      >
        <Divider>Break Details</Divider>
        <Form.Item name="startTime" label="Start Time" style={{ marginTop: "10px" }}>
          <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
        </Form.Item>
        <Form.Item name="endTime" label="End Time" style={{ marginTop: "10px" }}>
          <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
        </Form.Item>
      </Modal>
    </>
  );
};

export default Index;
