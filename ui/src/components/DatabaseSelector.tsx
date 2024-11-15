import React, { useEffect, useState } from "react";
import { Select, Spin, Row, Col } from 'antd';
import axios from 'axios';
const { Option } = Select;

interface DatabaseSelectorProps {
    selectedDatabase: string | null;
    setSelectedDatabase: (db: string) => void;
    setLoading: (loading: boolean) => void;
    isMobile: boolean;
}

const DatabaseSelector: React.FC<DatabaseSelectorProps> = ({ selectedDatabase, setSelectedDatabase, setLoading, isMobile }) => {
    const [databases, setDatabases] = useState<string[]>([]);
    const [loadingDatabases, setLoadingDatabases] = useState<boolean>(false);

    useEffect(() => {
        const fetchDatabases = async () => {
            setLoadingDatabases(true);
            try{
                const res = await axios.get('http://localhost:5252/databases');
                setDatabases(res.data);
            }catch(error){
                console.error("Error fetching databases: ", error);
            } finally{
                setLoadingDatabases(false);
            }
        }

        fetchDatabases();
    }, []);

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '32px' : '18px'
        }}>
            <p style={{
                fontSize: isMobile ? '14px' : '18px',
                fontWeight: '600'
            }}>Select Database: </p>
            <Spin spinning={loadingDatabases}>
                <Select 
                    value={selectedDatabase}
                    placeholder="Select a Database"
                    onChange={setSelectedDatabase}
                    loading={loadingDatabases}
                    allowClear
                    style={{width: 200}}
                >
                    {databases.map((db) => (
                        <Option key={db} value={db}>
                            {db}
                        </Option>
                    ))}
                </Select>
            </Spin>
        </div>
    )
};

export default DatabaseSelector;