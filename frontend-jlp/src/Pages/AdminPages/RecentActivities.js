import React, { useState, useEffect } from 'react';
import { 
  Tabs, Badge, Card, List, Avatar, Tag, Button, Skeleton, Empty, 
  Space, Dropdown, Menu, message, Row, Col, Statistic, Typography 
} from 'antd';
import {
  UserAddOutlined, ShoppingOutlined, CheckCircleOutlined,
  WarningOutlined, ClockCircleOutlined, BellOutlined, ShopOutlined,
  FilterOutlined, MoreOutlined, SyncOutlined, CheckOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';
import { fetchAllAlerts, markAllAlertAsRead, markAlertAsRead } from '../../APIS/API';
import AdminSidebar from "../../Components/AdminComponents/Adminsidebar";
import AdminNavbar from "../../Components/AdminComponents/AdminNavbar";
import {ActivityDetailsPanel} from '../../Components/AdminComponents/ActivityFeedDetails'
import NotificationCenter from "../../Services/alerts/NotificationCenter";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const ActivityPageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const StatsGrid = styled(Row)`
  margin-bottom: 24px;
  
  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    
    .ant-statistic-title {
      color: #6c757d;
      font-size: 14px;
    }
    
    .ant-statistic-content {
      color: #212529;
    }
  }
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  
  .ant-card-head {
    border-bottom: 1px solid #e9ecef;
    padding: 16px 24px;
    
    .ant-card-head-title {
      font-weight: 500;
    }
  }
  
  .ant-tabs-nav {
    padding: 0 24px;
    
    .ant-tabs-tab {
      padding: 12px 16px;
      margin-right: 8px;
      
      &:hover {
        color: #0d6efd;
      }
      
      &.ant-tabs-tab-active {
        color: #0d6efd;
        font-weight: 500;
      }
    }
  }
`;

const ActivityList = styled(List)`
  .ant-list-item {
    padding: 16px 24px;
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f8f9fa;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const ActivityTime = styled.span`
  color: #6c757d;
  font-size: 12px;
`;

const ActivityContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const ActivityTitle = styled.span`
  font-weight: 500;
  margin-bottom: 4px;
  color: #212529;
`;

const ActivityDescription = styled.span`
  color: #6c757d;
  font-size: 13px;
`;

const UnreadIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0d6efd;
  margin-right: 12px;
`;

const PrimaryButton = styled(Button)`
  background: #0d6efd;
  border-color: #0d6efd;
  color: white;
  
  &:hover {
    background: #0b5ed7;
    border-color: #0a58ca;
    color: white;
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  border-color: #dee2e6;
  color: #495057;
  
  &:hover {
    background: #f8f9fa;
    border-color: #ced4da;
    color: #495057;
  }
`;

const ActivityPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetchAllAlerts();
      const data = await response.data;
      setAlerts(data);
      setUnreadCount(data.filter(a => !a.isRead).length);
      message.success('Activities refreshed');
    } catch (error) {
      console.error('Error fetching alerts:', error);
      message.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAlerts();
  }, []);
  
  const markAsRead = async (id) => {
    try {
      await markAlertAsRead(id);
      fetchAlerts();
      message.success('Marked as read');
    } catch (error) {
      message.error('Failed to mark as read');
    }
  };
  
  const markAllAsRead = async () => {
    try {
      await markAllAlertAsRead();
      fetchAlerts();
      message.success('All activities marked as read');
    } catch (error) {
      message.error('Failed to mark all as read');
    }
  };
  
  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !alert.isRead;
    return alert.type === activeTab;
  });
  
  const getAlertIcon = (type) => {
    const iconStyle = { fontSize: '16px' };
    switch(type) {
      case 'NEW_USER':
        return <UserAddOutlined style={{ ...iconStyle, color: '#20c997' }} />;
      case 'NEW_EMPLOYER_ACCOUNT':
        return <ShopOutlined style={{ ...iconStyle, color: '#fd7e14' }} />;
      case 'NEW_JOB_POSTING':
        return <ShoppingOutlined style={{ ...iconStyle, color: '#0d6efd' }} />;
      case 'NEW_MICRO_JOB_POSTING':
        return <ShoppingOutlined style={{ ...iconStyle, color: '#6610f2' }} />;
      case 'MICRO_JOB_COMPLETION':
        return <CheckCircleOutlined style={{ ...iconStyle, color: '#198754' }} />;
      case 'DISPUTE_RAISED':
        return <WarningOutlined style={{ ...iconStyle, color: '#ffc107' }} />;
      default:
        return <BellOutlined style={{ ...iconStyle, color: '#6c757d' }} />;
    }
  };
  
  const getAlertTitle = (type) => {
    switch(type) {
      case 'NEW_USER':
        return 'New User Signed Up';
      case 'NEW_EMPLOYER_ACCOUNT':
        return 'New Employer Account';
      case 'NEW_JOB_POSTING':
        return 'New Job Posted';
      case 'NEW_MICRO_JOB_POSTING':
        return 'New Micro Job Posted';
      case 'MICRO_JOB_COMPLETION':
        return 'Job Completed';
      case 'DISPUTE_RAISED':
        return 'New Dispute Raised';
      default:
        return 'Notification';
    }
  };

  const getActivityStats = () => {
    const total = alerts.length;
    const unread = alerts.filter(a => !a.isRead).length;
    const todayAlerts = alerts.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.createdAt).toDateString() === today;
    }).length;
    
    return { total, unread, today: todayAlerts };
  };

  const stats = getActivityStats();
  
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<CheckOutlined />} onClick={markAllAsRead}>
        Mark all as read
      </Menu.Item>
      <Menu.Item key="2" icon={<SyncOutlined />} onClick={fetchAlerts}>
        Refresh
      </Menu.Item>
    </Menu>
  );

  return (
    <PageContainer>
      <AdminSidebar />
      <NotificationCenter/>
      <MainContent>
        <AdminNavbar />
        <ActivityPageContainer>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <HeaderSection>
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={3} style={{ marginBottom: 0 }}>Activity Dashboard</Title>
                  <Text type="secondary">Monitor system activities and notifications</Text>
                </Col>
                <Col>
                  <Space>
                    <SecondaryButton 
                      icon={<SyncOutlined />} 
                      onClick={fetchAlerts}
                      loading={loading}
                    >
                      Refresh
                    </SecondaryButton>
                    <Dropdown overlay={menu} placement="bottomRight">
                      <SecondaryButton icon={<MoreOutlined />} />
                    </Dropdown>
                  </Space>
                </Col>
              </Row>
            </HeaderSection>

            <StatsGrid gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div className="stat-card">
                  <Statistic
                    title="Total Activities"
                    value={stats.total}
                    prefix={<BellOutlined />}
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="stat-card">
                  <Statistic
                    title="Unread"
                    value={stats.unread}
                    prefix={<EyeOutlined />}
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="stat-card">
                  <Statistic
                    title="Today"
                    value={stats.today}
                    prefix={<ClockCircleOutlined />}
                  />
                </div>
              </Col>
            </StatsGrid>
            
            <StyledCard
              title={
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space size="middle">
                      <span>Activity Feed</span>
                      <Badge count={unreadCount} />
                    </Space>
                  </Col>
                  <Col>
                    <PrimaryButton 
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                      icon={<CheckOutlined />}
                    >
                      Mark all as read
                    </PrimaryButton>
                  </Col>
                </Row>
              }
            >
              <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab}
              >
                <TabPane 
                  tab={
                    <span>
                      <BellOutlined />
                      All
                    </span>
                  } 
                  key="all"
                />
                <TabPane 
                  tab={
                    <span>
                      <ClockCircleOutlined />
                      Unread
                    </span>
                  } 
                  key="unread"
                />
                <TabPane 
                  tab={
                    <span>
                      <UserAddOutlined />
                      Users
                    </span>
                  } 
                  key="NEW_USER"
                />
                <TabPane 
                  tab={
                    <span>
                      <ShopOutlined />
                      Employers
                    </span>
                  } 
                  key="NEW_EMPLOYER_ACCOUNT"
                />
                <TabPane 
                  tab={
                    <span>
                      <ShoppingOutlined />
                      Jobs
                    </span>
                  } 
                  key="NEW_JOB_POSTING"
                />
                <TabPane 
                  tab={
                    <span>
                      <ShoppingOutlined />
                      Micro Jobs
                    </span>
                  } 
                  key="NEW_MICRO_JOB_POSTING"
                />
                <TabPane 
                  tab={
                    <span>
                      <CheckCircleOutlined />
                      Completed
                    </span>
                  } 
                  key="MICRO_JOB_COMPLETION"
                />
                <TabPane 
                  tab={
                    <span>
                      <WarningOutlined />
                      Disputes
                    </span>
                  } 
                  key="DISPUTE_RAISED"
                />
              </Tabs>
              
              {loading ? (
                <div style={{ padding: '24px' }}>
                  <Skeleton active paragraph={{ rows: 6 }} />
                </div>
              ) : (
                <ActivityList
                  itemLayout="horizontal"
                  dataSource={filteredAlerts}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No activities found"
                      />
                    )
                  }}
                  renderItem={(alert) => (
                    <List.Item
                      extra={
                        <ActivityTime>
                          {new Date(alert.createdAt).toLocaleString()}
                        </ActivityTime>
                      }
                      style={{
                        background: alert.isRead ? 'none' : '#f8f9fa',
                        borderLeft: alert.isRead ? 'none' : '3px solid #0d6efd'
                      }}
                      onClick={() => {
                      markAsRead(alert.id);
                      setSelectedActivity(alert);
                     }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            icon={getAlertIcon(alert.type)} 
                            style={{ 
                              backgroundColor: 'rgba(13, 110, 253, 0.1)',
                              color: getAlertIcon(alert.type).props.style.color
                            }}
                          />
                        }
                        title={
                          <ActivityContent>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {!alert.isRead && <UnreadIndicator />}
                              <ActivityTitle>
                                {getAlertTitle(alert.type)}
                              </ActivityTitle>
                              {!alert.isRead && (
                                <Tag color="blue" style={{ marginLeft: 8, fontSize: 11 }}>
                                  New
                                </Tag>
                              )}
                            </div>
                            <ActivityDescription>
                              {alert.message || 'No additional details provided'}
                            </ActivityDescription>
                          </ActivityContent>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </StyledCard>
          </Space>
        </ActivityPageContainer>
        <ActivityDetailsPanel 
          activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
         />
      </MainContent>
    </PageContainer>
  );
};

export default ActivityPage;