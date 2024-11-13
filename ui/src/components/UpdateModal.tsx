import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, Form } from 'antd';

interface UpdateModalProps {
  loading: boolean;
  visible: boolean;
  handleModalClose: () => void;
  record?: any | null;
  schema?: any | null;
  onUpdate: (data: any) => void;
  mode: "update" | "delete" | "add" | null;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ loading, visible, handleModalClose, record, onUpdate, mode, schema }) => {
  const [data, setData] = useState<any>({});
  const [newData, setNewData] = useState<any>({});

  useEffect(() => {
    if (record) {
      setData(record);
    }
  }, [record])

  const handleRecordChange = (key: string, value: string) => {
    setData({ ...data, [key]: value, ["prev_id"]: record[Object.keys(record)[0]] });
  }

  const handleNewRecordChange = (key: string, value: string) => {
    setNewData({...newData, [key]: value });
  }

  const handleUpdate = () => {
    if (mode === 'add'){
      onUpdate(newData);
    }else{
      onUpdate(data);
    }
    handleModalClose();
    setNewData({});
  }
  return (
    <Modal
      title={<p>{mode === "update" ? "Update Data" : (mode === "delete" ? "Delete Data" : "Add Data")}</p>}
      footer={
        <>
          <Button key="cancel" onClick={handleModalClose}>
            Cancel
          </Button>
          {mode === "update" ? (
            <Button type="primary" onClick={handleUpdate} loading={loading}>
              Update
            </Button>
          ) : (mode === "delete" ?
            <Button danger={mode === "delete"} onClick={handleUpdate} loading={loading}>
              Delete
            </Button> :
            <Button type="primary" onClick={handleUpdate} loading={loading}>
              Add Data
            </Button>
          )}
        </>

      }
      confirmLoading={loading}
      open={visible}
      onCancel={handleModalClose}
      width={700}
    >
      {mode === "update" ? (
        data ? (
          <Form layout='vertical'>
            {Object.keys(data).map((key) => (
              key !== 'prev_id' && (
                <Form.Item key={key} label={key}>
                  <Input value={data[key]} onChange={(e) => { handleRecordChange(key, e.target.value) }} />
                </Form.Item>
              )
            ))}
          </Form>
        ) : (
          <p>No data available</p>
        )
      ) : (mode === "delete" ? (
        <p>You are about to delete a record with <span style={{ fontSize: '18px', fontWeight: 600, color: 'red' }}>{Object.keys(data)[0]}: {data[Object.keys(data)[0]]}</span> <br /> Do you want to proceed?</p>
      ) : (
        <Form layout='vertical'>
          {Object.keys(schema || {}).map((key) => (
            <Form.Item key={key} label={key}>
              <Input
                value={newData[key]}
                onChange={(e) => handleNewRecordChange(key, e.target.value)}
                placeholder={`Enter ${key}`}
              />
            </Form.Item>
          ))}
        </Form>
      )
      )}

    </Modal>
  )
}

export default UpdateModal;