import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import {Table, Spin, message, Space, Button, Popconfirm} from 'antd';
import {useHistory} from "react-router-dom";
import {deleteVoucherItem, fetchVoucher} from "./slice";
import {QuestionCircleOutlined} from "@ant-design/icons";
import voucherAPI from "../../services/voucher";
import moment from "moment";

export const VoucherPage = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const { listVoucher, isLoading } = useSelector(state => {
        const { list, loading} = state.voucher.voucherList;
        return {
            listVoucher: list,
            isLoading: loading,
        }
    });

    //id, name price priceSale new sale image like dislike origin unit quantitative ingredient note description Voucher_id out_of_product
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: "30%"
        },
        {
            title: 'Discount Price',
            dataIndex: 'discount_price',
            key: 'discount_price',
        },
        {
            title: 'Discount Percent',
            dataIndex: 'discount_percent',
            key: 'discount_percent',
        },
        {
            title: 'Min Price To Use',
            dataIndex: 'min_price_to_use',
            key: 'min_price_to_use',
        },
        {
            title: 'Expired In',
            dataIndex: 'expired_in',
            key: 'expired_in',
            render: (value) => moment.unix(value).format('DD/MM/YYYY')
        },
        {
            title: 'Action',
            key: 'Action',
            render: (text, record) => (
                <Space size="middle">
                    <Button style={{backgroundColor: 'orange', color: '#fff'}} onClick={() => history.push(`/update-voucher/${record.id}`)}>Sửa</Button>
                    <Popconfirm title={`Bạn có thật sự muốn xoá ${text.name} ？`}
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onCancel={() => {}}
                                onConfirm={() => handleDeleteVoucher(record.id)}
                    >
                        <Button style={{backgroundColor: 'red', color: '#fff'}}>Xoá</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    const handleDeleteVoucher = async (id) => {
        try {
            await voucherAPI.deleteVoucher(id);
            dispatch(deleteVoucherItem({id}));
            message.success('Xoá Thành Công');
        } catch (error) {
            message.error(error);
        }
    }

    useEffect(() => {
        getVoucherList();
    }, []);

    const getVoucherList = async () => {
        try {
            return dispatch(fetchVoucher());
        } catch (error) {
            message.error(error);
        }
    }

    return <div>
        <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Voucher</h1>
        {isLoading ? <div className='flex items-center justify-center'>
                <Spin size='large' />
            </div> :
            <div>
                <Button style={{backgroundColor: 'green', color: '#fff', float: 'right', margin: 20}} onClick={() => history.push(`/add-voucher`)}>Thêm</Button>
                <Table
                    className='default_table pointer_rows'
                    columns={columns}
                    dataSource={listVoucher}
                    // onRow={(record, rowIndex) => {
                    //     return {
                    //         onClick: (event) => {
                    //             history.push(`/detail-user/${record.id}`, { name: 'home' })
                    //         }
                    //     }
                    // }}
                    rowKey={() => Math.random()}
                    pagination={false}
                />
            </div>
        }
    </div>
}
