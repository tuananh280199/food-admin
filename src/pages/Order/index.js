import React, {useEffect, useState} from "react";
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {Table, Spin, message, Input, Space, Button} from 'antd';
import {useHistory} from "react-router-dom";
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import {fetchOrder} from "./slice";


export const OrderPage = () => {
    const { Search } = Input;

    const history = useHistory();
    const dispatch = useDispatch();

    const [freeWord, setFreeWord] = useState('');
    const { listOrder, isLoading, currentPage, hasNextPage } = useSelector(state => {
        const { list, loading, hasNext, page } = state.order.orderList;
        return {
            listOrder: list,
            isLoading: loading,
            currentPage: page,
            hasNextPage: hasNext,
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
            title: 'Customer',
            dataIndex: 'name',
            key: 'name',
            width: 200
        },
        {
            title: 'Shipping Address',
            dataIndex: 'shipping_address',
            key: 'shipping_address',
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Total Price',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Order Date',
            dataIndex: 'order_date',
            key: 'order_date',
            render: (value) => moment.unix(value).format('HH:mm DD/MM/YYYY')
        },
        {
            title: 'Action',
            key: 'Action',
            render: (text, record) => (
                <Space size="middle">
                    <Button style={{backgroundColor: 'green', color: '#fff'}} onClick={() => history.push(`/order-detail/${record.id}`, { name: 'order' })}>Chi Tiết</Button>
                    <Button style={{backgroundColor: 'orange', color: '#fff'}}>Sửa</Button>
                </Space>
            )
        },
    ];

    useEffect(() => {
        getOrderList();
    }, []);

    const getOrderList = async () => {
        try {
            // if(freeWord) {
            //     query.freeWord = freeWord
            // }
            return dispatch(fetchOrder({
                page : 1
            }));
        } catch (error) {
            message.error(error);
        }
    }

    const handleLoadData = async (action) => {
        try {
            const query = {
                page: 1
            }
            if(action === 'prev') {
                query.page= currentPage - 1
                if(freeWord) {
                    query.freeWord = freeWord
                }
                return dispatch(fetchOrder(query))
            }
            if (!hasNextPage) {
                return;
            }
            query.page= currentPage + 1
            if(freeWord) {
                query.freeWord = freeWord
            }
            return dispatch(fetchOrder(query))

        } catch (e) {
            message.error(e.message);
        }
    };

    const onSearch = (text) => {
        setFreeWord(text);
        // dispatch(fetchAllorders({page: 1, freeWord: text}));
    }

    return <div>
        <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Order</h1>
        {isLoading ? <div className='flex items-center justify-center'>
                <Spin size='large' />
            </div> :
            <div>
                <Search placeholder="Tên Khách Hàng" size="large" onPressEnter={e => onSearch(e.target.value)} onSearch={onSearch} className='mb-5' style={{maxWidth: 350}}/>
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
        <div className='flex justify-end mt-2 pb-2'>
            {currentPage === 1 ? <button className='mr-2'>
                <LeftOutlined style={{fontSize: '15px', color: '#D1D5DB', borderWidth: '1px', padding: '10px'}} />
            </button> : <button onClick={() => handleLoadData('prev')} className='mr-2'>
                <LeftOutlined style={{fontSize: '15px', color: '#9CA3AF', borderWidth: '1px', padding: '10px'}} />
            </button>}

            <button onClick={() => handleLoadData('next')}>
                <RightOutlined style={{fontSize: '15px', color: '#9CA3AF', borderWidth: '1px', padding: '10px'}} />
            </button>
        </div>
    </div>
}
