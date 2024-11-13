import React, { useState } from 'react';
import { Divider, Row, Col, Flex, Splitter, Button, Switch, message } from 'antd';
import QueryWindow from '../components/QueryWindow';
import ResultWindow from '../components/ResultWindow';
import DatabaseSelector from '../components/DatabaseSelector';
import axios from 'axios';

const DataQuerier: React.FC<any> = ({ db, table, setSelectedDatabase, loading, setLoading, isMobile }) => {
    const [sizes, setSizes] = useState<(number | string)[]>(['50%', '50%']);
    const [enabled, setEnabled] = useState(true);
    const [query, setQuery] = useState<any>(null);
    const [queryResult, setQueryResult] = useState<any>([]);

    const handleQuerySubmit = async () => {
        if (!query) {
            message.error("Query Cannot be Empty!");
            return;
        }
        try {
            const res = await axios.post("http://localhost:5252/data/custom", {
                db,
                table,
                query: query
            })
            message.success("Query Executed Successfully!")
            setQueryResult(res.data);
        } catch (error) {
            message.error("Error Executing Query");
        }
    }

    const handleReset = () => {
        setQuery(null);
        setQueryResult([]);
        setSizes(['50%', '50%']);
    }

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Query Editor</h1>
            <Divider />
            
            <Row justify="center">
                <Col xs={24} sm={24} md={16} lg={12} xl={8}>
                    <DatabaseSelector selectedDatabase={db} setSelectedDatabase={setSelectedDatabase} setLoading={setLoading} isMobile={isMobile}></DatabaseSelector>
                </Col>
            </Row>

            <Flex vertical gap="middle">
                <Splitter
                    onResize={setSizes}
                    style={{ height: 390, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                >
                    <Splitter.Panel size={sizes[0]} min={'25%'} resizable={enabled} style={{ backgroundColor: 'white' }}>
                        <div style={{ padding: '12px' }}>
                            <QueryWindow query={query} setQuery={setQuery} handleSubmit={handleQuerySubmit} />
                        </div>
                    </Splitter.Panel>

                    <Splitter.Panel size={sizes[1]} min={'45%'}>
                        <ResultWindow queryResult={queryResult} />
                    </Splitter.Panel>
                </Splitter>

                <Flex gap="middle" justify="space-between" style={{ padding: '16px' }}>
                    <Flex gap="middle" align="center">
                        <h5>Snap</h5>
                        <Switch
                            value={enabled}
                            onChange={() => setEnabled(!enabled)}
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                        />
                    </Flex>
                    <Flex align='center'>
                        <Button onClick={handleReset}>Reset Editor Window</Button>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
}

export default DataQuerier;
