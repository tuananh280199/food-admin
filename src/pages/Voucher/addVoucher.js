import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, Spin, message, InputNumber, DatePicker, Radio} from 'antd';
import {useHistory} from "react-router-dom";
import voucherAPI from "../../services/voucher";
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 12,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
};
/* eslint-enable no-template-curly-in-string */

export const AddVoucher = () => {
    const history = useHistory();
    const [submit, setSubmit] = useState(false);
    const [value, setValue] = React.useState(1);

    const onChange = e => {
        setValue(e.target.value);
    };

    const onFinish = async (values) => {
        try {
            setSubmit(true);
            const params = {
                name: values.name,
                discount_price : value === 1 ? values.discount_price : null,
                discount_percent: value === 2 ? values.discount_percent : null,
                min_price_to_use: values.min_price_to_use,
                expired_in: Math.floor(Number(values.expired_in.format('X')))
            }
            await voucherAPI.addVoucher(params);
            await message.success('Thêm thành công!');
            setSubmit(false);
            history.goBack();
        } catch (error) {
            setSubmit(false);
            message.error(error);
        }
    };

    return <>
        <div>
            <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Add Voucher</h1>
        </div>
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item
                name='name'
                label="Name"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={'radioBtn'}
                label="Choose Option Discount"
            >
                <Radio.Group onChange={onChange} defaultValue={value}>
                    <Radio value={1}>VND</Radio>
                    <Radio value={2}>%</Radio>
                    <Radio value={3}>Other</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                name={'discount_price'}
                label="Discount Price"
                rules={[
                    {
                        type: 'number',
                        min: 1000,
                        max: 100000000,
                    },
                ]}
            >
                <InputNumber style={{ width: 150 }} disabled={value !== 1}/>
            </Form.Item>
            <Form.Item
                name={'discount_percent'}
                label="Discount Percent (%)"
                rules={[
                    {
                        type: 'number',
                        min: 1,
                        max: 100,
                    },
                ]}
            >
                <InputNumber style={{ width: 150 }} disabled={value !== 2}/>
            </Form.Item>
            <Form.Item
                name={'min_price_to_use'}
                label="Min Price To Use"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 1000,
                        max: 100000000,
                    },
                ]}
            >
                <InputNumber style={{ width: 150 }}/>
            </Form.Item>
            <Form.Item
                name={'expired_in'}
                label="Expired In"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <DatePicker format={'DD/MM/YYYY'}/>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit" disabled={submit}>
                    {submit && <Spin style={{marginRight: 10}}/>} Submit
                </Button>
                <Button type="default" style={{marginLeft: 20}} onClick={() => history.push(`/voucher`)}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    </>;
};
