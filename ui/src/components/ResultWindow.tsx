import React from 'react';
import { Table, Typography } from 'antd';

interface ResultWindowProps {
  queryResult: any[];
}

const ResultWindow: React.FC<ResultWindowProps> = ({ queryResult }) => {
    // Check if the query result is empty or not
    if (queryResult.length === 0) {
        return <Typography.Text>No results to display</Typography.Text>;
    }

    // Extract columns dynamically from the first row of the queryResult
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
