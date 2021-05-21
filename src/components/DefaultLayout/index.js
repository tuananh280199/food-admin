import { Menu, BackTop, Button, message, Layout } from 'antd';
import {
    UserOutlined,
    BellOutlined,
    WarningOutlined,
    FileExclamationOutlined,
    PoweroffOutlined,
} from '@ant-design/icons';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../pages/LoginPage/slice";


export const DefaultLayout = ({children}) => {
    const history = useHistory();
    const pageName = history.location?.state?.name;
    const dispatch = useDispatch();
    const { Content, Sider } = Layout;
    const token = useSelector(state => state.auth.token);

    const handleLogout = () => {
        try {
            dispatch(logout());
        } catch (e) {
            message.error(e.message);
        }
    }

    return <Layout>
        <Sider
            style={{
                height: '100vh',
                position: 'fixed',
                left: 0,
            }}
        >
            <h1 className="p-4 text-white text-xl font-medium">KhoaiKhau Admin</h1>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[history.location.pathname === '/' ? 'home' : pageName]}
            >
                <Menu.Item key="home" onClick={() => history.push('/', { name: 'product' })}>
                    Product
                </Menu.Item>
                <Menu.Item key="category" onClick={() => history.push('/category', { name: 'category' })}>
                    Category
                </Menu.Item>
                <Menu.Item key="order" onClick={() => history.push('/order', { name: 'order' })}>
                    Order
                </Menu.Item>
                <Menu.Item key="user" onClick={() => history.push('/user', { name: 'user' })}>
                    User
                </Menu.Item>
            </Menu>
            <div className="flex items-center justify-center absolute bottom-9 w-full">
                <Button icon={<PoweroffOutlined />} type="primary" block onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </Sider>
        <Layout style={{ marginLeft: 200, backgroundColor: 'white' }}>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                {children}
            </Content>
        </Layout>
    </Layout>
}
