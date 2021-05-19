import React, {useState, useEffect} from "react";
import {Form, Input, Button} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import { useHistory } from "react-router-dom";

export const LoginPage = () => {
    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    let history = useHistory();
    const [ loading, setLoading ] = useState(false);

    const handleFinish = async (values) => {
        // try {
        //     setLoading(true);
        //     const { data } = await loginWithPhone(values.phone, values.password);
        //     setLoading(false);
        //     dispatch(login({ token: data.accessToken, profile: data.payload }));
        //     history.push("/");
        // } catch (e) {
        //     message.error(e.message);
        //     setLoading(false);
        // }
    };

    useEffect(() => {
        forceUpdate({});
    }, []);

    // useEffect(() => {
    //     if(authorize) {
    //         history.push("/");
    //     }
    // }, [authorize])

    return <div style={backgroundLogin}>
        <div style={backgroundFormLogin}>
            <div style={text}>WELCOME TO</div>
            <div style={text}>KHOAI KHAU</div>
            <div>
                <Form form={form} onFinish={handleFinish}>
                    <Form.Item
                        name="username"
                        style={{padding: 10}}
                    >
                        <UserOutlined style={{width: 20, height: 20, color: '#fff'}}/>
                        <Input placeholder="Username" style={{width: 200, height: 25}}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        style={{padding: 10}}
                    >
                        <LockOutlined style={{width: 20, height: 20, color: '#fff'}}/>
                        <Input
                            type="password"
                            placeholder="Password"
                            style={{width: 200, height: 25}}
                        />
                    </Form.Item>
                    <Form.Item shouldUpdate style={{padding: 10, textAlign: 'center'}}>
                        {() => (
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full"
                                style={{
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    paddingLeft: 30,
                                    paddingRight: 30
                                }}
                            >
                                Log in
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            </div>
        </div>
    </div>
}

const backgroundLogin = {
    backgroundImage: 'url(' + '/images/LoginBg.jpg' + ')',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
}

const text = {textAlign: 'center', margin: 10, fontSize: 24, color: '#fff'}

const backgroundFormLogin = {
    backgroundImage: 'url(' + '/images/LoginFormBg.png' + ')',
    backgroundSize: 'cover',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 200,
    paddingRight: 200,
    borderRadius: 10,
}
