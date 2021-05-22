import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, message, Select, InputNumber} from 'antd';
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import productAPI from "../../services/product";
import {fetchCategory} from "../Category/slice";
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
            await message.success('Cập nhật thành công!');
            history.goBack();
        } catch (error) {
            message.error(error);
        }
    };

    const onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            const data = new FormData();

            data.append('file', img);

            data.append('upload_preset', 'food-app');
            // data.append('cloud_name', 'dh4nrrwvy');

            fetch('https://api.cloudinary.com/v1_1/dh4nrrwvy/image/upload', {
                method: 'post',
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setImage(data.secure_url);
                })
                .catch((e) => message.error('Xảy ra lỗi. Vui lòng thử lại sau !'));
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
            {image && <div style={{marginLeft: 300, marginBottom: 50}}>
                <img src={image} style={{width: 70, height: 70}}/>
            </div>}
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
