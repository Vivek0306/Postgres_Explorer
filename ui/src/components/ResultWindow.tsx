import React from 'react';
import { Table, Typography } from 'antd';

interface ResultWindowProps {
  queryResult: any[];
}

const ResultWindow: React.FC<ResultWindowProps> = ({ queryResult }) => {
    if (queryResult.length === 0) {
        return <h3 style={{padding: '24px', textAlign:'center', color:'gray'}}>Run a query to display results!</h3>;
    }

    const columns = Object.keys(queryResult[0]).map(key => ({
        title: key.charAt(0).toUpperCase() + key.slice(1),
        dataIndex: key,
        key: key,
    }));

    return (
        <Table
            dataSource={queryResult}
            columns={columns}
            rowKey={(record, index) => (index !== undefined ? index.toString() : record.id || record.key)}
            pagination={false}
            bordered
        />
    );
};

export default ResultWindow;
