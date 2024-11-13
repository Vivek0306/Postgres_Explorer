import React, { useEffect, useState } from 'react';
import { Table, Row, Spin, Alert, Input } from 'antd';
import axios from 'axios';
import BreadcrumbNav from './BreadcrumbNav';

interface DataTableProps {
    db: string;
    table: string;
    setSelectedDatabase: () => void;
    setSelectedTable: () => void;
    isMobile: boolean;
}


const DataTable: React.FC<DataTableProps> = ({ db = "", table = "", setSelectedDatabase, setSelectedTable, isMobile }) => {
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5252/data?db=${db}&table=${table}`);
                const tableData = res.data;
                if (tableData.length > 0) {
                    const cols = Object.keys(tableData[0]).map((key: any) => ({
                        title: key,
                        dataIndex: key,
                        key: key,
                        // sorter: (a: any, b: any) => (a[key] > b[key] ? 1 : -1),
                    }));
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
        fetchData();
    }, [db, table]);


    useEffect(() => {
        const filtered = data.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(filtered);
    }, [searchTerm]);


    return (
        <Spin spinning={loading}>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />}
            <div>
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'start' : 'center',
                    justifyContent: isMobile ? 'start' : 'space-between'
                }}>
                    <BreadcrumbNav selectedDatabase={db} selectedTable={table} setSelectedDatabase={setSelectedDatabase} setSelectedTable={setSelectedTable} />
                    <Input.Search
                        placeholder="Search table data"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '300px' }}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={(record) => record.id || Math.random().toString()}
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
            />
        </Spin>
    )
}

export default DataTable;