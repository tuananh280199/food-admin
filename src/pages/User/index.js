import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import {Table, Spin, message, Input, Space, Button} from 'antd';
import {useHistory} from "react-router-dom";
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import {fetchUser, fetchUserSearchByName} from "./slice";


export const UserPage = () => {
    const { Search } = Input;

    const history = useHistory();
    const dispatch = useDispatch();

    const [freeWord, setFreeWord] = useState('');

    const { listUser, isLoading, currentPage, hasNextPage } = useSelector(state => {
        if(freeWord) {
            const { list, loading, hasNext, page } = state.user.userListSearch;
            return {
                listUser: list,
                isLoading: loading,
                currentPage: page,
                hasNextPage: hasNext,
            }
        }
        const { list, loading, hasNext, page } = state.user.userList;
        return {
            listUser: list,
            isLoading: loading,
            currentPage: page,
            hasNextPage: hasNext,
        }
    });

    //id, name price priceSale new sale image like dislike origin unit quantitative ingredient note description category_id out_of_user
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
            width: 200
        },
        {
            title: 'Nickname',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, record) => {
                return (
                    <div>
                        <img src={record.avatar} style={{width: 100, height: 100}}/>
                    </div>
                )
            }
        },
        {
            title: 'Action',
            key: 'Action',
            render: (text, record) => (
                <Space size="middle">
                    <Button style={{backgroundColor: 'red', color: '#fff'}}>Xoá</Button>
                </Space>
            )
        },
    ];

    useEffect(() => {
        getuserList();
    }, [freeWord]);

    const getuserList = async () => {
        try {
            if(freeWord) {
                return dispatch(fetchUserSearchByName({
                    keyWord: freeWord,
                    page : 1
                }));
            }
            return dispatch(fetchUser({
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
                    return dispatch(fetchUserSearchByName({
                        keyWord: freeWord,
                        page : currentPage - 1
                    }));
                }
                return dispatch(fetchUser({
                    page : currentPage - 1
                }));
            }
            if (!hasNextPage) {
                return;
            }
            if(freeWord) {
                return dispatch(fetchUserSearchByName({
                    keyWord: freeWord,
                    page : currentPage + 1
                }));
            }
            return dispatch(fetchUser({
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
        <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>User</h1>
        {isLoading ? <div className='flex items-center justify-center'>
                <Spin size='large' />
            </div> :
            <div>
                <Search placeholder="Tên Người Dùng" size="large" onPressEnter={e => onSearch(e.target.value)} onSearch={onSearch} className='mb-5' style={{maxWidth: 350}}/>
                <Table
                    className='default_table pointer_rows'
                    columns={columns}
                    dataSource={listUser}
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
