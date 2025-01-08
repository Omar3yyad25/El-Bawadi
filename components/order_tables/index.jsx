import React,{useState, useEffect} from 'react';
import { Descriptions, Button, Table, Typography  } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {CheckCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import Link from 'next/link';
import LoadingScreen from '../../components/LoadingScreen';
const { Text } = Typography;

const formatTitle = (title) => {
  const words = title.split('_');

  const formattedTitle = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return formattedTitle;
};

const Index = () => {
  const router = useRouter();
  const key= router.query.key;
  const type= router.query.type;

  const [loading, setLoading] = useState(true);

  const [responseData, setResponseData] = useState("");
  const [responseInfo, setResponseInfo] = useState("");


  useEffect(() => {

    const token = Cookies.get('token');

    axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + `/v1/User/Application/${type}/${key}`, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {

        if (response.data.message === "session expired") {
          router.push('/auth/login');
        }

        if (response.data.success === 0) {
          router.push('/dashboard');
        }

        setResponseData(response.data.message.data);
        setResponseInfo(response.data.message);

        setTimeout(() => {
          setLoading(false);
        }, 1000);
        
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [key, router, type]);



    const renderComponent = (label, type, data) => {
      if (type === 'text') {
        // Filter out items with children as null
        const items = Object.keys(data)
          .map((key) => ({
            label: formatTitle(key),
            children: data[key],
          }))
          .filter((item) => item.children !== null);

        return (
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div>
              <Text strong style={{ fontSize: '20px' }}>{formatTitle(responseData[label].label)}</Text>
            </div>
            <Descriptions
              bordered
              column={{
                xs: 1,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              items={items}
            />
          </div>
        );
      } else if (type === 'table' && Array.isArray(data) && data.length > 0) {
        const columns = Object.keys(data[0]).map((key) => ({
          title: formatTitle(key),
          dataIndex: key,
          key,
          render: (text, record) => {
            if (key === 'path') {
              const fullLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${text}`;
              return (
                <Link href={fullLink} target="_blank" rel="noopener noreferrer">
                  {text === null ? 'No path' : <span style={{color:'blue'}}>View Document</span>}
                </Link>
              );
            }
            if (key === 'shareholder_percentage') {
              return text === null ? 'No percentage' : text;
            }
            return text;
          },
        }));

        return (
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div style={{ marginTop: '30px' }}>
              <Text strong style={{ fontSize: '20px' }}>{formatTitle(responseData[label].label)}</Text>
            </div>

            <Table
              columns={columns}
              dataSource={data}
              scroll={{
                x: 1500,
              }}
              sticky={{
                offsetHeader: 64,
              }}
            />
          </div>
        );
      }
    };

    if (loading) {
      return <LoadingScreen />;
    }
    return (
      <>
        <div className="row y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32">
          <div className="col-xl-6">
            <h1 className="text-20 lh-14 fw-600">Application ID: {key}</h1>
          </div>
          <div className="col-xl-6">
            { responseInfo?.status === 'submitted'? (
              <div className='row'>
                <h1 className="text-20 lh-14 fw-600">Status: {responseInfo?.status} <CheckCircleFilled style={{color:"green"}}/></h1>
              </div>
            ):(
              <h1 className="text-20 lh-14 fw-600">Status: {responseInfo?.status}<InfoCircleFilled style={{color:"red", marginLeft:'5px'}}/></h1>
            )
            }
          </div>
        </div>
        <div className="row  justify-between items-end pb-30 lg:pb-40 md:pb-32">
          <div className="col-xl-6">
            <h1 className="text-20 lh-14 fw-600">Branch: {responseInfo.branch?.branch_name}</h1>
          </div>
          <div className="col-xl-6">
            <h1 className="text-20 lh-14 fw-600">Type: {responseInfo.type ==="requestcredit" ?(
              <span>Request Credit</span>
            ):(
              <span>Register Branch</span>
            )}
            </h1>
          </div>
        </div>
        {responseData !== undefined && responseData !== null && responseData !== "" ? (
          <div>
          {Object?.keys(responseData).map((key) => (
            <div key={key}>
              {renderComponent(key, responseData[key].type, responseData[key].data)}
            </div>
          ))}
        </div>):(
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-xl-6">
                <h1 className="text-20 lh-14 fw-600">No Data Found</h1>
              </div>
            </div>
          </div>
        )}
        {/* <div className="py-30 px-30 rounded-4 bg-white shadow-3">
          <Button type="primary">Submit</Button>
        </div> */}
      </>
    );
}

export default Index