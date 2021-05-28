import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, message, Select, Spin} from 'antd';
import userAPI from "../../services/user";
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 4,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
};
/* eslint-enable no-template-curly-in-string */

export const UpdateRole = () => {
    const {Option} = Select;
    const params = useParams();
    const history = useHistory();
    const { id } = params;

    const profile = useSelector(state => state.auth.profile);

    const { roleValue } = useSelector(state => {
        const {role} = state.user.userList.list.find(item => item.id === Number(id));
        return {
            roleValue: role,
        }
    });

    const [role, setRole] = useState(roleValue || '');
    const [submit, setSubmit] = useState(false);

    const onFinish = async () => {
        try {
            setSubmit(true);
            await userAPI.updateRole(role, id);
            await message.success('Cập nhật thành công!');
            setSubmit(false);
            history.goBack();
        } catch (error) {
            setSubmit(false);
            message.error(error);
        }
    };

    const onChangeRole = (value) => {
        setRole(value);
    }

    if(profile?.role !== 'admin') {
        return (
            <></>
        )
    }

    return <>
        <div>
            <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Update Role Of User</h1>
        </div>
        <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{ role: role }}
        >
            <Form.Item
                name='role'
                label="Role"
            >
                <Select defaultValue={false} style={{ width: 200 }} onChange={onChangeRole}>
                    <Option value={''}>no role</Option>
                    <Option value={'admin'}>admin</Option>
                    <Option value={'staff'}>staff</Option>
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4, marginTop: 20 }}>
                <Button type="primary" htmlType="submit" disabled={submit}>
                    {submit && <Spin style={{marginRight: 10}}/>} Submit
                </Button>
                <Button type="default" style={{marginLeft: 20}} onClick={() => history.push(`/user`)}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    </>;
};
