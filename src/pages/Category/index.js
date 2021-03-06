import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import {Table, Spin, message, Space, Button, Popconfirm} from 'antd';
import {useHistory} from "react-router-dom";
import {deleteCategoryItem, fetchCategory} from "./slice";
import categoryAPI from "../../services/category";
import {QuestionCircleOutlined} from "@ant-design/icons";

export const CategoryPage = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const { listCategory, isLoading } = useSelector(state => {
        const { list, loading} = state.category.categoryList;
        return {
            listCategory: list,
            isLoading: loading,
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
            width: "50%"
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: "30%",
            render: (text, record) => {
                return (
                    <div>
                        <img src={record.image} style={{width: 100, height: 100}}/>
                    </div>
                )
            }
        },
        {
            title: 'Action',
            key: 'Action',
            render: (text, record) => (
                <Space size="middle">
                    <Button style={{backgroundColor: 'orange', color: '#fff'}} onClick={() => history.push(`/update-category/${record.id}`)}>Sửa</Button>
                    <Popconfirm title={`Bạn có thật sự muốn xoá ${text.name} ？`}
                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                onCancel={() => {}}
                                onConfirm={() => handleDeleteCategory(record.id)}
                    >
                        <Button style={{backgroundColor: 'red', color: '#fff'}}>Xoá</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    const handleDeleteCategory = async (id) => {
        try {
            await categoryAPI.deleteCategory(id);
            dispatch(deleteCategoryItem({id}));
            message.success('Xoá Thành Công');
        } catch (error) {
            message.error(error);
        }
    }

    useEffect(() => {
        getCategoryList();
    }, []);

    const getCategoryList = async () => {
        try {
            return dispatch(fetchCategory());
        } catch (error) {
            message.error(error);
        }
    }

    return <div>
        <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Category</h1>
        {isLoading ? <div className='flex items-center justify-center'>
                <Spin size='large' />
            </div> :
            <div>
                <Button style={{backgroundColor: 'green', color: '#fff', float: 'right', margin: 20}} onClick={() => history.push(`/add-category`)}>Thêm</Button>
                <Table
                    className='default_table pointer_rows'
                    columns={columns}
                    dataSource={listCategory}
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
