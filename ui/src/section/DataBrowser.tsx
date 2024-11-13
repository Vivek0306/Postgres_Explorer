import React from 'react';
import { Row, Col, Divider } from 'antd';
import DatabaseSelector from '../components/DatabaseSelector';
import TableSelector from '../components/TableSelector';
import DataTable from '../components/DataTable';

const DataBrowser: React.FC<any> = ({ setSelectedDatabase, setSelectedTable, loading, setLoading, selectedDatabase, selectedTable, isMobile }) => {
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Browse your data here!</h1>
            <Divider />
            <Row>
                <Col md={12} sm={24}>
                    <DatabaseSelector selectedDatabase={selectedDatabase} setSelectedDatabase={setSelectedDatabase} setLoading={setLoading} isMobile={isMobile}></DatabaseSelector>
                </Col>
                {selectedDatabase &&
                    (
                        <Col md={12} sm={24}>
                            <TableSelector db={selectedDatabase} selectedTable={selectedTable} setSelectedTable={setSelectedTable} isMobile={isMobile}></TableSelector>
                        </Col>
                    )
                }
            </Row>
            <div style={{display: 'flex'}}>
                    {selectedTable && (
                        <div style={{ padding: '24px', overflowX: 'auto' }}>
                            <DataTable
                                db={selectedDatabase as string}
                                table={selectedTable as string}
                                setSelectedDatabase={setSelectedDatabase}
                                setSelectedTable={setSelectedTable}
                                isMobile={isMobile}
                            />
                        </div>
                    )}
            </div>
        </>
    )
};

export default DataBrowser;