import React, { useState, useEffect } from 'react';
import { Table, Button , Space, Typography, Input} from 'antd';
import {CheckCircleFilled, InfoCircleFilled, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoadingScreen from '../../components/LoadingScreen';

const Index = () => {
    const router = useRouter();

    const { Text, Link } = Typography;

    const [loading, setLoading] = useState(false);

    const searchApi = (type, key) => {
        router.push({
            pathname: '/dashboard/application',
            query: {type: type, key: key},
        });
    }

    const [registerBranchData, setRegisterBranchData] = useState([]);
    const [requestCreditData, setRequestCreditData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = Cookies.get('token');
          const headers = {
            authorization: token
          };
          const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + '/v1/User/Applications', {headers}); 
          const { registerbranch, requestcredit } = response.data.message;
  
          if (response.data.message === "session expired") {
            router.push('/auth/login');
          }
          setRegisterBranchData(registerbranch);
          setRequestCreditData(requestcredit);

          setTimeout(() => {
            setLoading(false);
          }, 1000);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [router]);

    const registerBranchColumns = [
      {
        title: 'Account Id',
        dataIndex: 'account_id',
        key: 'account_id',
        width: 50,
        fixed: 'left',
        ...getColumnSearchProps('account_id'), 
      },
      {
        title: 'Application Id',
        dataIndex: 'application_id',
        key: 'application_id',
        width: 150,
        ...getColumnSearchProps('application_id'), 
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 50,
        render: (text, record) => {
          if (record.status === "submitted") {
            return (
              <Text type="success" strong><CheckCircleFilled style={{ marginRight: '5px' }} />{record.status}</Text>
            )
          }
          else {
            return (
              <Text type="error" strong> <InfoCircleFilled style={{ marginRight: '5px', color: 'red' }} />{record.status}</Text>
            )
          }
        },
        filters: [
          { text: 'Submitted', value: 'submitted' },
          { text: 'Incomplete', value: 'incomplete' }, 
        ],
        onFilter: (value, record) => record.status === value,
      },
      {
        title: 'Creation Date',
        dataIndex: 'creation_date',
        key: 'creation_date',
        width: 100,
        ...getColumnSearchProps('creation_date'), 
      },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => <Button type="primary" onClick={() => searchApi("registerbranch", record.application_id)}>Search</Button>,
      },
    ];
    
    const requestCreditColumns = [
      {
        title: 'Account Id',
        dataIndex: 'account_id',
        key: 'account_id',
        width: 50,
        fixed: 'left',
        ...getColumnSearchProps('account_id'), 
      },
      {
        title: 'Application Id',
        dataIndex: 'application_id',
        key: 'application_id',
        width: 150,
        ...getColumnSearchProps('application_id'), 
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 50,
        render: (text, record) => {
          if (record.status === "submitted") {
            return (
              <Text type="success" strong><CheckCircleFilled style={{ marginRight: '5px' }} />{record.status}</Text>
            )
          }
          else {
            return (
              <Text type="error" strong> <InfoCircleFilled style={{ marginRight: '5px', color: 'red' }} />{record.status}</Text>
            )
          }
        },
        filters: [
          { text: 'Submitted', value: 'submitted' },
          { text: 'Incomplete', value: 'incomplete' },
        ],
        onFilter: (value, record) => record.status === value,
      },
      {
        title: 'Creation Date',
        dataIndex: 'creation_date',
        key: 'creation_date',
        width: 100,
        ...getColumnSearchProps('creation_date'), 
      },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => <Button type="primary" onClick={() => searchApi("requestcredit", record.application_id)}>Search</Button>,
      },
    ];
    
    
    function getColumnSearchProps(dataIndex) {
      let searchInput;
    
      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={(node) => {
                searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.select(), 100);
          }
        },
        render: (text) => (text),
      };
    }
    
    function handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
    }
    
    function handleReset(clearFilters) {
      clearFilters();
    }
    
      if (loading) {
        return <LoadingScreen />;
      }

      return (
        <>
        <div className="row y-gap-30 pt-20 bg-white rounded-4 chart_responsive">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div style={{marginTop:'30px'}}>
              <Text strong style={{fontSize:'20px'}}>Register Branch</Text>
            </div>
            <Table
              columns={registerBranchColumns}
              dataSource={registerBranchData}
              scroll={{
                x: 1500,
              }}
              
              sticky={{
                offsetHeader: 64,
              }}
            />
            <Space/>

            
          </div>
        </div>
        <div className="row y-gap-30 pt-20 bg-white rounded-4 chart_responsive">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div style={{marginTop:'20px'}}>
              <Text strong style={{fontSize:'20px'}}>Request Credit</Text>
            </div>
            <Table
              columns={requestCreditColumns}
              dataSource={requestCreditData}
              scroll={{
                x: 1500,
              }}
              
              sticky={{
                offsetHeader: 64,
              }}
            />
            <Space/>

            
          </div>
        </div>
        </>
      );
}

export default Index;