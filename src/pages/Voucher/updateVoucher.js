import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, message, Spin, InputNumber, DatePicker, Radio} from 'antd';
import voucherAPI from "../../services/voucher";
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import moment from "moment";

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

export const UpdateVoucher = () => {
    const params = useParams();
    const history = useHistory();
    const { id } = params;
    const { voucherObj } = useSelector(state => {
        const voucherById = state.voucher.voucherList.list.find(item => item.id === Number(id));
        return {
            voucherObj: voucherById,
        }
    });
    const optionDiscount = voucherObj?.discount_price ? 1 : voucherObj?.discount_percent ? 2 : 3;
    const [name] = useState(voucherObj?.name || '');
    const [discountPrice, setDiscountPrice] = useState(voucherObj?.discount_price || null);
    const [discountPercent, setDiscountPercent] = useState(voucherObj?.discount_percent || null);
    const [minPriceToUse] = useState(voucherObj?.min_price_to_use || null);
    const [submit, setSubmit] = useState(false);
    const [value, setValue] = React.useState(optionDiscount);

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
            await voucherAPI.updateVoucher(params, id);
            await message.success('Cập nhật thành công!');
            setSubmit(false);
            history.goBack();
        } catch (error) {
            setSubmit(false);
            message.error(error);
        }
    };

    return <>
        <div>
            <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Update voucher</h1>
        </div>
        <Form
            {...layout}
              name="nest-messages"
              onFinish={onFinish}
              validateMessages={validateMessages}
              initialValues={{ name: name,
            discount_price : discountPrice,
            discount_percent: discountPercent ,
            min_price_to_use: minPriceToUse,
              }}
        >
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
