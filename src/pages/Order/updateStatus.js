import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Button, message, Select, Spin} from 'antd';
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import orderAPI from "../../services/order";
import socket from "../../SocketIO/socket";
import {UPDATE_STATUS} from "../../SocketIO/constants";
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

export const UpdateStatus = (props) => {
    const {Option} = Select;
    const params = useParams();
    const history = useHistory();
    const { id } = params;
    const user_id = props.location.state?.user_id;

    const profile = useSelector(state => state.auth.profile);

    const { statusValue } = useSelector(state => {
        const {status} = state.order.orderList.list.find(item => item.id === Number(id));
        return {
            statusValue: status,
        }
    });

    const [status, setStatus] = useState(statusValue || 'Chờ Xác Nhận');
    const [submit, setSubmit] = useState(false);

    const onFinish = async () => {
        try {
            setSubmit(true);
            await orderAPI.updateOrderStatus(status, id, user_id);
            socket.authEmit(UPDATE_STATUS, {order_id: Number(id), user_id, status})
            await message.success('Cập nhật thành công!');
            setSubmit(false);
            history.goBack();
        } catch (error) {
            setSubmit(false);
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
                    {/*<Option value={'Chờ Xác Nhận'}>Chờ Xác Nhận</Option>*/}
                    <Option value={'Xác Nhận Đơn Hàng'}>Xác Nhận Đơn Hàng</Option>
                    <Option value={'Đang Giao Hàng'}>Đang Giao Hàng</Option>
                    <Option value={'Đã Giao'}>Đã Giao</Option>
                    <Option value={'Huỷ Đơn Hàng'}>Huỷ Đơn Hàng</Option>
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4, marginTop: 20 }}>
                <Button type="primary" htmlType="submit" disabled={submit}>
                    {submit && <Spin style={{marginRight: 10}}/>} Submit
                </Button>
                <Button type="default" style={{marginLeft: 20}} onClick={() => history.push(`/order`)}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    </>;
};
