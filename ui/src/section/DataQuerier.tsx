import React from 'react';
import { Divider, Row, Col } from 'antd';

const DataQuerier: React.FC<any> = () => {
    return <>
        <h1 style={{ textAlign: 'center' }}>Query Editor</h1>
        <Divider />
        <Row justify='center' align='middle'>
            <Col span={10}>Query Editor</Col>
            <Col span={14}>Results</Col>
        </Row>
    </>
}

export default DataQuerier;