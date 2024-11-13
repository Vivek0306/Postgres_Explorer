import React from 'react';
import { Row, Col, Divider } from 'antd';
import DatabaseSelector from '../components/DatabaseSelector';
import TableSelector from '../components/TableSelector';
import UpdateTable from '../components/UpdateTable';

const DataUpdater: React.FC<any> = ({ setSelectedDatabase, setSelectedTable, loading, setLoading, selectedDatabase, selectedTable }) => {
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Update your data here!</h1>
            <Divider />
            <Row>
                <Col md={12} sm={24}>
                    <DatabaseSelector selectedDatabase={selectedDatabase} setSelectedDatabase={setSelectedDatabase} setLoading={setLoading}></DatabaseSelector>
                </Col>
                {selectedDatabase &&
                    (
                        <Col md={12} sm={24}>
                            <TableSelector db={selectedDatabase} selectedTable={selectedTable} setSelectedTable={setSelectedTable}></TableSelector>
                        </Col>
                    )
                }
            </Row>
            <div>
                <Divider variant='dotted' />
                {selectedTable &&
                    (
                        <UpdateTable db={selectedDatabase as string} table={selectedTable as string} setSelectedDatabase={setSelectedDatabase} setSelectedTable={setSelectedTable} />
                    )}
            </div>
        </>
    )
};

export default DataUpdater;