import React, {useEffect, useState} from "react";
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {Table, Spin, message, Input, Space, Button} from 'antd';
import {useParams} from "react-router-dom";
import {fetchOrderDetail} from "./slice";


export const OrderDetailPage = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const { id } = params;
    
    const { listOrder, isLoading} = useSelector(state => {
        const { list, loading } = state.order.orderDetail;
        return {
            listOrder: list,
            isLoading: loading,
        }
    });

    //id, name price priceSale new sale image like dislike origin unit quantitative ingredient note description category_id out_of_order
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Product Price',
            dataIndex: 'product_price',
            key: 'product_price',
        },
        {
            title: 'Product Quantity',
            dataIndex: 'product_quantity',
            key: 'product_quantity',
        },
    ];

    useEffect(() => {
        getOrderList();
    }, []);

    const getOrderList = async () => {
        try {
            return dispatch(fetchOrderDetail({
                order_id : id
            }));
        } catch (error) {
            message.error(error);
        }
    }

    return <div>
        <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Order Detail</h1>
        {isLoading ? <div className='flex items-center justify-center'>
                <Spin size='large' />
            </div> :
            <div>
                <Table
                    className='default_table pointer_rows'
                    columns={columns}
                    dataSource={listOrder}
                    // onRow={(record, rowIndex) => {
                    //     return {
                    //         onClick: (event) => {
                    //             history.push(`/detail-order/${record.id}`, { name: 'home' })
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
