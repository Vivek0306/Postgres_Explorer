import React, {useState} from 'react';
import { Input, Form, Button } from 'antd';

interface QueryWindowProps {
    query: any;
    setQuery: (value: string) => void;
    handleSubmit: () => void;
}

const { TextArea } = Input;
const QueryWindow: React.FC<QueryWindowProps> = ({query, setQuery, handleSubmit}) => {
    const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(e.target.value);
    }
    return (
        <div>
            <Form name='query-entry' layout='horizontal'>
                <Form.Item required={true}>
                    <TextArea rows={10} value={query} onChange={handleQueryChange}/>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleSubmit} // handle submit
                    >
                        Submit Query
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default QueryWindow;
