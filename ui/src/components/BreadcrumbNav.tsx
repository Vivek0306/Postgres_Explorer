import React, { useState, useEffect } from 'react'
import { Button, Spin, Dropdown, message, Space } from 'antd';
import type { MenuProps } from 'antd';
import axios from 'axios';
import {
    DownOutlined,
    DatabaseOutlined,
    TableOutlined
} from '@ant-design/icons';


interface BreadcrumbNavProps {
    selectedDatabase: string | null;
    selectedTable: string | null;
    setSelectedDatabase: (db: string) => void;
    setSelectedTable: (table: string) => void;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({selectedDatabase, selectedTable, setSelectedDatabase, setSelectedTable}) => {
    const [databases, setDatabases] = useState<string[]>([]);
    const [tables, setTables] = useState<string[]>([]);
    const [loadingTables, setLoadingTables] = useState<boolean>(false);

    const [loadingDB, setLoadingDB] = useState<boolean>(false);

    useEffect(() => {
        const fetchDatabases = async () => {
            setLoadingDB(true);
            try{
                const res = await axios.get('http://localhost:5252/databases');
                setDatabases(res.data);
            }catch(error){
                console.error("Error fetching databases: ", error);
            } finally{
                setLoadingDB(false);
            }
        }
        fetchDatabases();
    }, []);

    useEffect(() => {
        const fetchTables = async () => {
          if (selectedDatabase) {
            setLoadingTables(true);
            try {
              const response = await axios.get(`http://localhost:5252/tables/${selectedDatabase}`);
              setTables(response.data);
            } catch (error) {
              console.error("Error fetching tables:", error);
            } finally {
              setLoadingTables(false);
            }
          }
        };
    
        fetchTables();
      }, [selectedDatabase]);

    const handleDBMenuClick: MenuProps['onClick'] = (e) => {
        const selectedDb = databases[Number(e.key)];
        message.info(`Selected ${selectedDb}`)
        setSelectedDatabase(selectedDb);
    };
    const handleTableMenuClick: MenuProps['onClick'] = (e) => {
        const selectedTable = tables[Number(e.key)];
        message.info(`Selected ${selectedTable}`)
        setSelectedTable(selectedTable);
    };

    const itemsDB: MenuProps['items'] = databases.map((option, index) => ({
        label: option,
        key: index
    }))
    const itemsTable: MenuProps['items'] = tables.map((option, index) => ({
        label: option,
        key: index
    }))


    const dbMenuProps = {
        items: itemsDB,
        onClick: handleDBMenuClick,
    };

    const tableMenuProps = {
        items: itemsTable,
        onClick: handleTableMenuClick,
    };
    return (
        <div>
            <Spin spinning = {loadingDB }>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    {selectedDatabase && (
                        <Dropdown menu={dbMenuProps}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <DatabaseOutlined />
                                    {selectedDatabase || "Database"}
                                    {/* <DownOutlined /> */}
                                </Space>
                            </a>
                        </Dropdown>
                    )}
                    
                    {selectedDatabase && tables.length > 0 && (
                        <>
                            <h3>/</h3>
                            <Dropdown menu={tableMenuProps}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <TableOutlined />
                                        {selectedTable  || "Table"}
                                        {/* <DownOutlined /> */}
                                    </Space>
                                </a>
                            </Dropdown>
                        </>
                    )}
                </div>
            </Spin>
        </div>
    )
}

export default BreadcrumbNav;