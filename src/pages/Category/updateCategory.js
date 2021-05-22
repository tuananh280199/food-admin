import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, message} from 'antd';
import categoryAPI from "../../services/category";
import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
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

export const UpdateCategory = () => {
    const params = useParams();
    const history = useHistory();
    const { id } = params;
    const { categoryObj } = useSelector(state => {
        const categoryById = state.category.categoryList.list.find(item => item.id === Number(id));
        return {
            categoryObj: categoryById,
        }
    });
    const [nameCate] = useState(categoryObj?.name || '');
    const [image, setImage] = useState(categoryObj?.image || null);

    const onFinish = async (values) => {
        try {
            const params = {
                name: values.name,
                image
            }
            await categoryAPI.updateCategory(params, id);
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

    return <>
        <div>
            <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Update Category</h1>
        </div>
        <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            initialValues={{ name: nameCate }}
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
                <Input type="file" name="myImage" onChange={onImageChange}/>
            </Form.Item>
            {image && <div style={{marginLeft: 300, marginBottom: 50}}>
                <img src={image} style={{width: 70, height: 70}}/>
            </div>}
            {/*<Form.Item*/}
            {/*    name={['user', 'age']}*/}
            {/*    label="Age"*/}
            {/*    rules={[*/}
            {/*        {*/}
            {/*            type: 'number',*/}
            {/*            min: 0,*/}
            {/*            max: 99,*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*>*/}
            {/*    <InputNumber />*/}
            {/*</Form.Item>*/}
            {/*<Form.Item name={['user', 'website']} label="Website">*/}
            {/*    <Input />*/}
            {/*</Form.Item>*/}
            {/*<Form.Item name={['user', 'introduction']} label="Introduction">*/}
            {/*    <Input.TextArea />*/}
            {/*</Form.Item>*/}
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button type="default" style={{marginLeft: 20}} onClick={() => history.push(`/category`)}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    </>;
};
