import React, { useEffect, useState } from 'react';
import { Select, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;

interface TableSelectorProps {
  db: string | null;
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  isMobile: boolean;
}

const TableSelector: React.FC<TableSelectorProps> = ({ db, selectedTable, setSelectedTable, isMobile }) => {
  const [tables, setTables] = useState<string[]>([]);
  const [loadingTables, setLoadingTables] = useState<boolean>(false);


  useEffect(() => {
    const fetchTables = async () => {
      if (db) {
        setLoadingTables(true);
        try {
          const response = await axios.get(`http://localhost:5252/tables/${db}`);
          setTables(response.data); // Assuming the response is an array of table names
        } catch (error) {
          console.error("Error fetching tables:", error);
        } finally {
          setLoadingTables(false);
        }
      }
    };

    fetchTables();
  }, [db]);

  useEffect(() => {
    setSelectedTable(null);
  }, [db])

  return (
    <div  style={{
      display: 'flex',
      flexDirection: 'row', 
      justifyContent: 'center',
      alignItems: 'center',
      gap: isMobile ? '56px' : '18px'

    }}>
      <p style={{
                fontSize: isMobile ? '14px' : '18px',
                fontWeight: isMobile ? '600' : '600'
            }}>Select Table:</p>
      <Spin spinning={loadingTables}>
        <Select
          showSearch
          value={selectedTable}
          style={{ width: 200 }}
          placeholder="Select a table"
          onChange={setSelectedTable}
          allowClear
          loading={loadingTables}
        >
          {tables.map((table) => (
            <Option key={table} value={table}>
              {table}
            </Option>
          ))}
        </Select>
      </Spin>
    </div>
  );
};

export default TableSelector;
