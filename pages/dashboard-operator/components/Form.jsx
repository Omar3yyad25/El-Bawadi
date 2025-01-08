import React, { useState } from 'react';
import { Button, Form, Modal, InputNumber, message } from 'antd';
import shiftSubmission from '../../../utils/shiftSubmission';

const App = ({ activeShiftId }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    submit(values);
    setOpen(false);
  };

  const submit = (values) => {
    const { filling_machine, wasted_unites } = values;
    const shift = activeShiftId;
    const submitRes = shiftSubmission(shift, filling_machine, wasted_unites);
    if (submitRes) {
      message.success("Shift submitted successfully");
      form.resetFields(); // Reset the form fields
    } else {
      message.error("Failed to submit shift");
    }
  };

  return (
    <>
      <Button type="primary" shape="round"  style={{backgroundColor:"#428D40"}} onClick={() => setOpen(true)}>
        Click Here
      </Button>

      <Modal
        open={open}
        title="Submit after shift submission"
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{
          autoFocus: true,
          htmlType: 'submit',
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: 'public',
            }}
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item label="Count of filling machine">
          <Form.Item name="filling_machine" noStyle>
            <InputNumber min={1} max={10} />
          </Form.Item>
          <span className="ant-form-text" style={{ marginLeft: 8 }}>
            Units
          </span>
        </Form.Item>
        <Form.Item label="Count of wasted units">
          <Form.Item name="wasted_unites" noStyle>
            <InputNumber min={1} max={10} />
          </Form.Item>
          <span className="ant-form-text" style={{ marginLeft: 8 }}>
            Units
          </span>
        </Form.Item>
      </Modal>
    </>
  );
};

export default App;
