import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button, Spin, message} from 'antd';
import categoryAPI from "../../services/category";
import {useHistory} from "react-router-dom";
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

export const AddCategory = () => {
    const history = useHistory();
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(false);
    const [submit, setSubmit] = useState(false);

    const onFinish = async (values) => {
        try {
            setSubmit(true);
            const params = {
                name: values.name,
                image
            }
            await categoryAPI.addCategory(params);
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

    return <>
        <div>
            <h1 className='pt-5 pb-5 pl-5 text-lg font-medium'>Add Category</h1>
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
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit" disabled={submit}>
                    {submit && <Spin style={{marginRight: 10}}/>} Submit
                </Button>
                <Button type="default" style={{marginLeft: 20}} onClick={() => history.push(`/category`)}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    </>;
};
