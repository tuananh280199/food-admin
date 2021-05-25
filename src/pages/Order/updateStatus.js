import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, message, Select} from 'antd';
import userAPI from "../../services/user";
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import orderAPI from "../../services/order";
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

export const UpdateStatus = () => {
    const {Option} = Select;
    const params = useParams();
    const history = useHistory();
    const { id } = params;

    const profile = useSelector(state => state.auth.profile);

    const { statusValue } = useSelector(state => {
        const {status} = state.order.orderList.list.find(item => item.id === Number(id));
        return {
            statusValue: status,
        }
    });

    const [status, setStatus] = useState(statusValue || 'Chờ Xác Nhận');

    const onFinish = async () => {
        try {
            await orderAPI.updateOrderStatus(status, id);
            await message.success('Cập nhật thành công!');
            history.goBack();
        } catch (error) {
            message.error(error);
        }
    };

    const onChangeRole = (value) => {
        setStatus(value);
    }

    if(profile?.role !== 'admin') {
        return (
            <></>
        )
    }

    return <>
        <div>
            <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Update Order Status</h1>
        </div>
        <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{ status: status }}
        >
            <Form.Item
                name='status'
                label="Status"
            >
                <Select defaultValue={false} style={{ width: 200 }} onChange={onChangeRole}>
                    <Option value={'Chờ Xác Nhận'}>Chờ Xác Nhận</Option>
                    <Option value={'Xác Nhận Đơn Hàng'}>Xác Nhận Đơn Hàng</Option>
                    <Option value={'Đang Giao Hàng'}>Đang Giao Hàng</Option>
                    <Option value={'Đã Giao'}>Đã Giao</Option>
                    <Option value={'Huỷ Đơn Hàng'}>Huỷ Đơn Hàng</Option>
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4, marginTop: 20 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button type="default" style={{marginLeft: 20}} onClick={() => history.push(`/order`)}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    </>;
};
