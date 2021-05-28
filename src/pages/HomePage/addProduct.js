import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, message, InputNumber, Select, Spin} from 'antd';
import {useHistory} from "react-router-dom";
import productAPI from "../../services/product";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategory} from "../Category/slice";
import axios from "axios";

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
    types: {
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */

export const AddProduct = () => {
    const dispatch = useDispatch();
    const { Option } = Select;
    const history = useHistory();

    const { listCategory } = useSelector(state => {
        const { list} = state.category.categoryList;
        return {
            listCategory: list,
        }
    });

    const [image, setImage] = useState(null);
    const [subImage, setSubImage] = useState([]);
    const [newProduct, setNewProduct] = useState(false);
    const [saleProduct, setSaleProduct] = useState(false);
    const [outOfProduct, setOutOfProduct] = useState(false);
    const [categoryID, setCategoryID] = useState(1);
    const [price, setPrice] = useState(1001);
    const [loading, setLoading] = useState(false);
    const [subLoading, setSubLoading] = useState(false);
    const [submit, setSubmit] = useState(false);

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

    const onFinish = async (values) => {
        try {
            setSubmit(true);
            const params = {
                name : values.name,
                price : values.price,
                priceSale : saleProduct ? values.priceSale : null,
                new : newProduct ? 1 : 0,
                sale : saleProduct ? 1 : 0,
                image : image,
                origin : values.origin,
                unit : values.unit ,
                quantitative : values.quantitative,
                ingredient : values.ingredient,
                note : values.note,
                description : values.description,
                category_id : categoryID,
                out_of_product : outOfProduct ? 1 : 0,
            }
            const {data} = await productAPI.addProduct(params);
            await productAPI.addSubImage(subImage, data.insertId);
            await message.success('Thêm thành công!');
            setSubmit(false);
            history.goBack();
        } catch (error) {
            setSubmit(false);
            message.error(error);
        }
    };

    const onImageChange = async event => {
        try {
            setLoading(true);
            if (event.target.files && event.target.files[0]) {
                let img = event.target.files[0];
                const data = new FormData();

                data.append('file', img);

                data.append('upload_preset', 'food-app');

                const res = await axios.post('https://api.cloudinary.com/v1_1/dh4nrrwvy/image/upload', data);
                setImage(res.data.secure_url);
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            message.error(e);
        }
    };

    const onSubImageChange = async event => {
        try {
            setSubLoading(true);
            if (event.target.files) {
                let data;
                let images = [];
                for(let i = 0; i < event.target.files.length ; i ++) {
                    data = new FormData();

                    data.append('file', event.target.files[i]);

                    data.append('upload_preset', 'food-app');

                    const res = await axios.post('https://api.cloudinary.com/v1_1/dh4nrrwvy/image/upload',data);
                    images.push(res.data.secure_url);
                }
                setSubImage(images);
            }
            setSubLoading(false);
        } catch (e) {
            setSubLoading(false);
            message.error(e);
        }
    };

    const onChangeNew = (value) => {
        setNewProduct(value);
    }

    const onChangeSale = (value) => {
        setSaleProduct(value);
    }

    const onChangeOutOfProduct = (value) => {
        setOutOfProduct(value);
    }

    const onChangeCategory = (value) => {
        setCategoryID(value);
    }

    const handleChangePrice = (value) => {
        setPrice(value);
    }


    return <>
        <div>
            <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Add Product</h1>
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
                name='image'
                label="Image"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input type="file" name="myImage" onChange={onImageChange} />
            </Form.Item>
            {
                loading ? <div style={{display: 'inline-flex', marginLeft: 300, marginBottom: 30}}>
                    <p>Uploading...</p>
                </div> : image && <div style={{marginLeft: 300, marginBottom: 30}}>
                    <img src={image} style={{width: 70, height: 70}}/>
                </div>
            }
            <Form.Item
                name='multiple_image'
                label="Sub Image"
            >
                <Input type="file" multiple name="myImage" onChange={onSubImageChange} />
            </Form.Item>
            {
                subLoading ? <div style={{display: 'inline-flex', marginLeft: 300, marginBottom: 30}}>
                    <p>Uploading...</p>
                </div> : subImage.length > 0 &&
                    <div style={{display: 'inline-flex', marginLeft: 300, marginBottom: 30}}>
                        {subImage.map((item, index) => (
                            <div style={{marginLeft: 10, float: "left"}} key={index}>
                                <img src={item} style={{width: 70, height: 70}}/>
                            </div>
                        ))
                        }
                    </div>
            }
            <Form.Item
                name='new'
                label="New"
            >
                <Select defaultValue={false} style={{ width: 200 }} onChange={onChangeNew}>
                    <Option value={false}>False</Option>
                    <Option value={true}>True</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name='sale'
                label="Sale"
            >
                <Select defaultValue={false} style={{ width: 200 }} onChange={onChangeSale}>
                    <Option value={false}>False</Option>
                    <Option value={true}>True</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name={'price'}
                label="Price"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 1000,
                        max: 100000000,
                    },
                ]}
            >
                <InputNumber style={{ width: 150 }} onChange={handleChangePrice}/>
            </Form.Item>
            <Form.Item
                name={'priceSale'}
                label="Price Sale"
                rules={[
                    {
                        required: saleProduct ? true : false,
                        type: 'number',
                        min: 1000,
                        max: price - 1,
                    },
                ]}
            >
                <InputNumber style={{ width: 150 }} disabled={!saleProduct}/>
            </Form.Item>
            <Form.Item
                name={'origin'}
                label="Origin">
                <Input />
            </Form.Item>
            <Form.Item
                name={'unit'}
                label="Unit">
                <Input />
            </Form.Item>
            <Form.Item
                name={'quantitative'}
                label="Quantitative">
                <Input />
            </Form.Item>
            <Form.Item
                name={'ingredient'}
                label="Ingredient">
                <Input />
            </Form.Item>
            <Form.Item
                name={'note'}
                label="Note">
                <Input />
            </Form.Item>
            <Form.Item
                name='out_of_product'
                label="Out Of Product"
            >
                <Select defaultValue={false} style={{ width: 200 }} onChange={onChangeOutOfProduct}>
                    <Option value={false}>False</Option>
                    <Option value={true}>True</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name='category'
                label="Category"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select defaultValue={'Choose category'} style={{ width: 200 }} onChange={onChangeCategory}>
                    {
                        listCategory.map((item, index) => (
                            <Option value={item.id}>{item.name}</Option>
                        ))
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name={'description'}
                label="Description">
                <Input.TextArea rows={10} maxLength={500}/>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit" disabled={submit}>
                    {submit && <Spin style={{marginRight: 10}}/>} Submit
                </Button>
                <Button type="default" style={{marginLeft: 20}} onClick={() => history.push(`/home`)}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    </>;
};
