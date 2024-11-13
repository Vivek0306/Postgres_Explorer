import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Input, Button, message } from 'antd';
import axios from 'axios';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from "@ant-design/icons";
import { ColumnsType } from 'antd/es/table';
import UpdateModal from './UpdateModal';
import BreadcrumbNav from './BreadcrumbNav';

interface UpdateTableProps {
    db: string;
    table: string;
    setSelectedDatabase: () => void;
    setSelectedTable: () => void;
}


const UpdateTable: React.FC<UpdateTableProps> = ({ db = "", table = "", setSelectedDatabase, setSelectedTable }) => {
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
    const [mode, setMode] = useState<"update" | "delete" | "add" | null>(null);
    const [schema, setSchema] = useState<any>({});

    const fetchSchema = async () => {
        try{
            const res = await axios.get(`http://localhost:5252/columns?db=${db}&table=${table}`);
            setSchema(res.data);
        } catch(error){
            console.error("Error fetching table data: ", error);
        }
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5252/data?db=${db}&table=${table}`);
            let tableData = res.data;
            // setSchema(tableData[0]);
            if (tableData.length > 0) {
                const primaryKey = Object.keys(tableData[0])[0];

                tableData = tableData.sort((a: any, b: any) => {
                    if (a[primaryKey] < b[primaryKey]) return -1;
                    if (a[primaryKey] > b[primaryKey]) return 1;
                    return 0;
                });

                const cols: ColumnsType<any> = Object.keys(tableData[0]).map((key: any) => ({
                    title: key,
                    dataIndex: key,
                    key: key,
                }));
                cols.push({
                    title: 'Actions',
                    key: 'edit',
                    render: (_: any, record: any) => (
                        <><Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            type="link"
                        />
                            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} type='link' style={{ color: 'red' }} />
                            {/* <Button icon={<PlusOutlined />} onClick={handleAdd} type='link' style={{ color: 'green' }} /> */}
                        </>
                    ),
                });
                setColumns(cols);
            }
            setData(tableData);
            setFilteredData(tableData);
        } catch (error) {
            console.error("Error fetching table data: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        fetchSchema()
    }, [db, table]);

    const handleAdd = () => {
        setOpenModal(true);
        setMode("add");
    }

    const handleEdit = (record: any) => {
        setOpenModal(true);
        setSelectedRecord(record);
        setMode("update");
    }

    const handleDelete = (record: any) => {
        setMode("delete");
        setSelectedRecord(record);
        setOpenModal(true);
    }

    const onUpdate = async (updatedData: any) => {
        if (mode === "update") {
            if (!updatedData) return;
            setLoading(true);
            try {
                const pkey = updatedData[Object.keys(updatedData)[0]];
                await axios.put(`http://localhost:5252/update`, {
                    db,
                    table,
                    id: pkey,
                    data: updatedData,
                    prevId: updatedData.prev_id
                });
                setData((prevData) =>
                    prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
                );
                fetchData()
                message.success("Data updated successfully!");
            } catch (error: any) {
                message.error(`Failed to update data in the database.`);
            } finally {
                setLoading(false);
                setMode(null);
                setOpenModal(false);
            }
        } else if (mode === "delete") {
            if (!updatedData) return;
            setLoading(true);
            try {
                await axios.delete(`http://localhost:5252/delete`, {
                    params: {
                        db,
                        table,
                        id: updatedData[Object.keys(updatedData)[0]],
                        key: Object.keys(updatedData)[0]
                    }
                });
                fetchData()
                message.success("Data deleted successfully!");
            } catch (error: any) {
                message.error(`Failed to delete data in the database.`);
            } finally {
                setLoading(false);
                setMode(null);
                setOpenModal(false);
            }
        } else {
            if (!updatedData) return;
            setLoading(true);
            try {
                await axios.post(`http://localhost:5252/data/add`, {
                    db,
                    table,
                    record: updatedData
                });
                fetchData()
                message.success("Data inserted successfully!");
            } catch (error: any) {
                message.error(`Failed to insert data into the database.`);
            } finally {
                setLoading(false);
                setMode(null);
                setOpenModal(false);
            }
        }

    };

    const handleModalClose = () => {
        setSelectedRecord(null);
        setMode(null);
        setOpenModal(false);
    }

    useEffect(() => {
        const filtered = data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(filtered);
    }, [searchTerm]);


    return (
        <div>
            {/* <h2>Table Data for {table}</h2> */}
            <Spin spinning={loading}>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <BreadcrumbNav selectedDatabase={db} selectedTable={table} setSelectedDatabase={setSelectedDatabase} setSelectedTable={setSelectedTable} />
                    <Input.Search
                        placeholder="Search table data"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '300px' }}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={(record) => record.id || Math.random().toString()}
                    pagination={{ pageSize: 10 }}
                    footer={() => (
                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <Button variant='solid' color='primary' style={{backgroundColor: 'green'}} onClick={handleAdd}>
                                Add Data
                            </Button>
                        </div>)}
                />
                <UpdateModal loading={loading} visible={openModal} handleModalClose={handleModalClose} record={selectedRecord} onUpdate={onUpdate} mode={mode} schema={schema} />
            </Spin>
        </div>
    )
}

export default UpdateTable;