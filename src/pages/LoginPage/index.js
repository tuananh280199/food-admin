import React, {useState, useEffect} from "react";
import {Form, Input, Button, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import authAPI from "../../services/auth";
import {login} from "./slice";

export const LoginPage = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    let history = useHistory();
    const [ loading, setLoading ] = useState(false);
    const authorize = useSelector(state => state.auth.isLoggedIn);

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            const params = {
                username: values.username,
                password: values.password,
            };
            const response = await authAPI.login(params);
            await dispatch(
                login({
                    token: response.profile.access_token,
                    profile: response.profile,
                }),
            );
            setLoading(false);
            history.push("/");
        } catch (e) {
            message.error(e.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        forceUpdate({});
    }, []);

    useEffect(() => {
        if(authorize) {
            history.push("/");
        }
    }, [authorize])

    return <div className="h-full w-full flex items-center justify-center" style={backgroundLogin}>
        <div className="w-2/6 p-6 shadow-2xl rounded-lg" style={backgroundFormLogin}>
            <div className="mt-10 text-5xl text-center font-bold text-white">WELCOME</div>
            <div className="text-center mb-10 mt-10 text-white">DEAEL APP</div>
            <div className="flex items-center justify-center">
                <Form form={form} onFinish={handleFinish} className="w-72">
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your phone!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Phone"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your password!'}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item shouldUpdate>
                        {() => (
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full"
                                disabled={
                                    !form.isFieldsTouched(true) ||
                                    !!form.getFieldsError().filter(({errors}) => errors.length).length
                                }
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
