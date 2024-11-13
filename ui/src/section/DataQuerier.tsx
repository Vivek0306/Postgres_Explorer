import React, { useState } from 'react';
import { Divider, Row, Col, Flex, Splitter, Button, Switch, message } from 'antd';
import QueryWindow from '../components/QueryWindow';
import ResultWindow from '../components/ResultWindow';
import DatabaseSelector from '../components/DatabaseSelector';
import axios from 'axios';

const DataQuerier: React.FC<any> = ({ db, table, setSelectedDatabase, loading, setLoading }) => {
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
            message.success("Query Executed Successfulyy!")
            setQueryResult(res.data);
        } catch (error) {
            message.error("Error Executing Query");
        }
    }


    return <>
        <h1 style={{ textAlign: 'center' }}>Query Editor</h1>
        <Divider />
        <Row>
            <Col md={12} sm={24}>
                <DatabaseSelector selectedDatabase={db} setSelectedDatabase={setSelectedDatabase} setLoading={setLoading}></DatabaseSelector>
            </Col>
        </Row>
        <Flex vertical gap="middle">
            <Splitter
                onResize={setSizes}
                style={{ height: 390, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
            >
                <Splitter.Panel size={sizes[0]} resizable={enabled} style={{ backgroundColor: 'white' }}>
                    <QueryWindow query={query} setQuery={setQuery} handleSubmit={handleQuerySubmit} />
                </Splitter.Panel>
                <Splitter.Panel size={sizes[1]}>
                    <ResultWindow queryResult={queryResult} />
                </Splitter.Panel>
            </Splitter>
            <Flex gap="middle" justify="space-between">
                <Switch
                    value={enabled}
                    onChange={() => setEnabled(!enabled)}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                />
                <Button onClick={() => setSizes(['50%', '50%'])}>Reset</Button>
            </Flex>
        </Flex>
    </>
}

export default DataQuerier;