import React, { useEffect, useState } from "react";
import { Layout, Spin, Menu, Button } from 'antd';
import DataBrowser from "./section/DataBrowser";
import DataUpdater from "./section/DataUpdater";
import DataQuerier from "./section/DataQuerier";
import {
  FileSearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  CodeOutlined
} from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

const App: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'view' | 'query' | 'update'>((localStorage.getItem('menu') as 'view'| 'query' | 'update') || 'view');
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(localStorage.getItem('database'));
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(localStorage.getItem('table'));
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSelectedTable(null);
    localStorage.setItem('database', selectedDatabase as string);
  }, [selectedDatabase]);

  useEffect(() => {
    localStorage.setItem('table', selectedTable as string);
    localStorage.setItem('database', selectedDatabase as string);
  }, [selectedTable]);

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedView(key as 'view' | 'query' | 'update');
    localStorage.setItem('menu', selectedView);
  }

  return (
    <Layout>
      <Sider
        width={240}
        trigger={null}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div style={{
          color: 'white',
          fontSize: '18px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <p>Database Explorer</p>
        </div>
        <div style={{
          marginTop: '12px'
        }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[localStorage.getItem('menu') || 'view']}
            onClick={handleMenuClick}
            items={[
              { key: 'view', icon: <FileSearchOutlined />, label: 'View Data' },
              { key: 'update', icon: <EditOutlined />, label: 'Update Data' },
              { key: 'query', icon: <CodeOutlined />, label: 'Query Editor' },
            ]}
          />
        </div>
      </Sider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ backgroundColor: '#001529', padding: '0 20px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: 'white'
            }}
          />
        </Header>
        <Content style={{ padding: '10px' }}>
          <Spin spinning={loading}>
            {selectedView === 'view' &&
              <DataBrowser
                setSelectedDatabase={setSelectedDatabase}
                setSelectedTable={setSelectedTable}
                selectedDatabase={selectedDatabase}
                selectedTable={selectedTable}
                loading={loading}
                setLoading={setLoading}
                isMobile={isMobile}
              />}
            {selectedView === 'update' &&
              <DataUpdater
                setSelectedDatabase={setSelectedDatabase}
                setSelectedTable={setSelectedTable}
                selectedDatabase={selectedDatabase}
                selectedTable={selectedTable}
                loading={loading}
                setLoading={setLoading}
                isMobile={isMobile}
              />}
            {selectedView === 'query' &&
              <DataQuerier 
                setSelectedDatabase={setSelectedDatabase}  
                db={selectedDatabase} 
                table={selectedTable}
                loading={loading}
                setLoading={setLoading} 
                isMobile={isMobile}
              />}
          </Spin>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Database Explorer ©2024</Footer>
      </Layout>
    </Layout>
  )
}

export default App;
