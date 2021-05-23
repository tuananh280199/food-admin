import React, {useEffect, useState} from "react";
import moment from "moment";
import { useSelector, useDispatch } from 'react-redux';
import {Table, Spin, message, Input, Space, Button, Popconfirm} from 'antd';
import {useHistory} from "react-router-dom";
import {LeftOutlined, QuestionCircleOutlined, RightOutlined} from '@ant-design/icons';
import {deleteProductItem, fetchDataSearchByName, fetchProduct} from "./slice/homeSlice";
import categoryAPI from "../../services/category";
import {deleteCategoryItem} from "../Category/slice";
import productAPI from "../../services/product";


export const HomePage = () => {
    const { Search } = Input;

    const history = useHistory();
    const dispatch = useDispatch();

    const [freeWord, setFreeWord] = useState('');
    const { listProduct, isLoading, currentPage, hasNextPage } = useSelector(state => {
        if(freeWord) {
            const { list, loading, hasNext, page } = state.product.productListSearch;
            return {
                listProduct: list,
                isLoading: loading,
                currentPage: page,
                hasNextPage: hasNext,
            }
        }
        const { list, loading, hasNext, page } = state.product.productList;
        return {
            listProduct: list,
            isLoading: loading,
            currentPage: page,
            hasNextPage: hasNext,
        }
    });


    //id, name price priceSale new sale image like dislike origin unit quantitative ingredient note description category_id out_of_product
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
            width: 130
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'PriceSale',
            dataIndex: 'priceSale',
            key: 'priceSale',
        },
        {
            title: 'New',
            dataIndex: 'new',
            key: 'new',
            render: (value) => {
                return (
                    value === 1 && (
                        <p>Mới</p>
                    )
                )
            }
        },
        {
            title: 'Sale',
            dataIndex: 'sale',
            key: 'sale',
            render: (value) => {
                return (
                    value === 1 && (
                        <p>Giảm Giá</p>
                    )
                )
            }
        },
        {
            title: 'Out_of_product',
            dataIndex: 'out_of_product',
            key: 'out_of_product',
            render: (value) => {
                return (
                    value === 1 && (
                        <p>Hết Hàng</p>
                    )
                )
            }
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text, record) => {
                return (
                    <div>
                        <img src={record.image} style={{width: 70, height: 70}}/>
                    </div>
                )
            }
        },
        {
            title: 'Origin',
            dataIndex: 'origin',
            key: 'origin',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Quantitative',
            dataIndex: 'quantitative',
            key: 'quantitative',
        },
        {
            title: 'Ingredient',
            dataIndex: 'ingredient',
            key: 'ingredient',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            width: 110,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'Action',
            render: (text, record) => (
                <Space size="middle">
                    <Button style={{backgroundColor: 'orange', color: '#fff'}} onClick={() => history.push(`/update-product/${record.id}`)}>Sửa</Button>
                    <Popconfirm title={`Bạn có thật sự muốn xoá ${text.name} ？`}
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onCancel={() => {}}
                                onConfirm={() => handleDeleteProduct(record.id)}
                    >
                        <Button style={{backgroundColor: 'red', color: '#fff'}}>Xoá</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    const handleDeleteProduct = async (id) => {
        try {
            await productAPI.deleteProduct(id);
            await productAPI.deleteSubImage(id);
            dispatch(deleteProductItem({id}));
            message.success('Xoá Thành Công');
        } catch (error) {
            message.error(error);
        }
    }

    useEffect(() => {
        getProductList();
    }, [freeWord]);

    const getProductList = async () => {
        try {
            if(freeWord) {
                return dispatch(fetchDataSearchByName({
                    keyWord: freeWord,
                    page : 1
                }));
            }
            return dispatch(fetchProduct({
                page : 1
            }));
        } catch (error) {
            message.error(error);
        }
    }

    const handleLoadData = async (action) => {
        try {
            if(action === 'prev') {
                if(freeWord) {
                    return dispatch(fetchDataSearchByName({
                        keyWord: freeWord,
                        page : currentPage - 1
                    }));
                }
                return dispatch(fetchProduct({
                    page : currentPage - 1
                }));
            }
            if (!hasNextPage) {
                return;
            }
            if(freeWord) {
                return dispatch(fetchDataSearchByName({
                    keyWord: freeWord,
                    page : currentPage + 1
                }));
            }
            return dispatch(fetchProduct({
                page : currentPage + 1
            }));

        } catch (e) {
            message.error(e.message);
        }
    };

    const onSearch = (text) => {
        setFreeWord(text);
        // dispatch(fetchAllUsers({page: 1, freeWord: text}));
    }

    return <div>
        <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Product</h1>
        {isLoading ? <div className='flex items-center justify-center'>
                <Spin size='large' />
            </div> :
            <div>
                <Search placeholder="Tên Sản Phẩm" size="large" onPressEnter={e => onSearch(e.target.value)} onSearch={onSearch} className='mb-5' style={{maxWidth: 350}}/>
                <Button style={{backgroundColor: 'green', color: '#fff', float: 'right', margin: 20}} onClick={() => history.push(`/add-product`)}>Thêm</Button>
                <Table
                    className='default_table pointer_rows'
                    columns={columns}
                    dataSource={listProduct}
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
