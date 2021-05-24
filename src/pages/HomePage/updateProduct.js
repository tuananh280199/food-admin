import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, message, Select, InputNumber} from 'antd';
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import productAPI from "../../services/product";
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
};
/* eslint-enable no-template-curly-in-string */

export const UpdateProduct = () => {
    const dispatch = useDispatch();
    const { Option } = Select;
    const history = useHistory();
    const params = useParams();
    const { id } = params;

    const { listCategory } = useSelector(state => {
        const { list} = state.category.categoryList;
        return {
            listCategory: list,
        }
    });

    const { listProduct } = useSelector(state => {
        const list = state.product.productList.list.find(item => item.id === Number(id));
        return {
            listProduct: list,
        }
    });

    const [name] = useState(listProduct?.name || '');
    const [image, setImage] = useState(listProduct?.image || null);
    const [subImage, setSubImage] = useState([]);
    const [newProduct, setNewProduct] = useState((listProduct?.new === 1 ? true : false) || false);
    const [saleProduct, setSaleProduct] = useState((listProduct?.sale === 1 ? true : false) || false);
    const [outOfProduct, setOutOfProduct] = useState( (listProduct?.out_of_product === 1 ? true : false) || false);
    const [categoryID, setCategoryID] = useState(listProduct?.category_id || 1);
    const [price, setPrice] = useState(listProduct?.price || 1001);
    const [priceSale] = useState(listProduct?.priceSale || null);
    const [origin] = useState(listProduct?.origin || '');
    const [unit] = useState(listProduct?.unit || '');
    const [quantitative] = useState(listProduct?.quantitative || '');
    const [ingredient] = useState(listProduct?.ingredient || '');
    const [note] = useState(listProduct?.note || '');
    const [description] = useState(listProduct?.description || '');
    const [loading, setLoading] = useState(false);
    const [subLoading, setSubLoading] = useState(false);

    useEffect(() => {
        getCategoryList();
        getSubImage();
    }, []);

    const getCategoryList = async () => {
        try {
            return dispatch(fetchCategory());
        } catch (error) {
            message.error(error);
        }
    }

    const getSubImage = async () => {
        try {
            const {data} = await productAPI.getDetailProduct(id);
            const images = data.photos.map(item => item.image);
            setSubImage(images);
        } catch (error) {
            message.error(error);
        }
    }

    const onFinish = async (values) => {
        try {
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
            await productAPI.updateProduct(params, id);
            if(subImage.length > 0) {
                await productAPI.deleteSubImage(id);
                await productAPI.addSubImage(subImage, id);
            }
            await message.success('Cập nhật thành công!');
            history.goBack();
        } catch (error) {
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
            <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Update Product</h1>
        </div>
        <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{
                name: name,
                new: newProduct,
                sale: saleProduct,
                price: price,
                priceSale: priceSale,
                origin : origin,
                unit : unit ,
                quantitative : quantitative,
                ingredient : ingredient,
                note : note,
                description : description,
                category : categoryID,
                out_of_product : outOfProduct,
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
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button type="default" style={{marginLeft: 20}} onClick={() => history.push(`/home`)}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    </>;
};
