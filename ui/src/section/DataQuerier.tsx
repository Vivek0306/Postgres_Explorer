import React, { useState } from 'react';
import { Divider, Row, Col, Flex, Splitter, Button, Switch, message } from 'antd';
import QueryWindow from '../components/QueryWindow';
import ResultWindow from '../components/ResultWindow';
import DatabaseSelector from '../components/DatabaseSelector';
import axios from 'axios';
import Link from 'antd/es/typography/Link';
import { tab } from '@testing-library/user-event/dist/tab';

const DataQuerier: React.FC<any> = ({ db, table, setSelectedDatabase, loading, setLoading, isMobile }) => {
    const [sizes, setSizes] = useState<(number | string)[]>(['50%', '50%']);
    const [enabled, setEnabled] = useState(true);
    const [query, setQuery] = useState<any>(null);
    const [queryResult, setQueryResult] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    // Query for listing available tables
    const listTablesQuery = 'SELECT table_name as table FROM information_schema.tables WHERE table_schema=\'public\'';

    const handleQuerySubmit = async (listTablesQuery?: string) => {
        setLoading(true);
        if (!query) {
            message.error("Query Cannot be Empty!");
            setLoading(false);
            return;
        }
        try {
            // const cleaned = query.trim()

            const res = await axios.post("http://localhost:5252/data/custom", {
                db,
                table,
                query: query

            })
            message.success("Query Executed Successfully!");
            setQueryResult(res.data);
        } catch (error) {
            message.error("Error Executing Query");
            console.log(error, query)
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setQuery(null);
        setQueryResult([]);
        setSizes(['50%', '50%']);
    };

    const suggestions = [
        ['Query to list available tables in the Database', listTablesQuery],
        ['Query to get the first 10 rows from a table', 'SELECT * FROM your_table_name LIMIT 10'],
        ['Query to count the number of records in a table', 'SELECT COUNT(*) FROM your_table_name'],
        ['Query to list all column names in a table', 'SELECT column_name FROM information_schema.columns WHERE table_name = \'your_table_name\''],
        ['Query to get the distinct values in a column', 'SELECT DISTINCT column_name FROM your_table_name']
    ];

    const handleSuggestion = () => {
        let suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        message.info(suggestion[0]);
        setQuery(suggestion[1]);
    };

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Query Editor</h1>
            <Divider />
            <Row justify="center">
                <Col xs={24} sm={24} md={16} lg={12} xl={8}>
                    <DatabaseSelector selectedDatabase={db} setSelectedDatabase={setSelectedDatabase} setLoading={setLoading} isMobile={isMobile} />
                </Col>
            </Row>
            <Flex vertical gap="middle">
                <Splitter
                    onResize={setSizes}
                    style={{ height: 390, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                >
                    <Splitter.Panel size={sizes[0]} min={'25%'} resizable={enabled} style={{ backgroundColor: 'white', padding: '12px' }}>
                        <QueryWindow query={query} setQuery={setQuery} handleSubmit={handleQuerySubmit} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                            <Link onClick={() => setQuery(listTablesQuery)}>List Available Tables</Link>
                            <Link onClick={handleSuggestion}>Not Sure?</Link>
                        </div>
                    </Splitter.Panel>

                    <Splitter.Panel size={sizes[1]} min={'45%'}>
                        <ResultWindow queryResult={queryResult} loading={loading} />
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
                    <Flex align="center">
                        <Button onClick={handleReset}>Reset Editor Window</Button>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
}

export default DataQuerier;
