import {Helmet} from 'react-helmet-async';
import {Button, Card, Container, Stack, Typography} from '@mui/material';
import {DatePickerElement, FormContainer, SelectElement, TextFieldElement} from 'react-hook-form-mui';
import {ButtonBack} from '../components/button/back-button/ButtonBack';
import {axiosClient} from "../utils/axiosClient";
import {useState} from "react";
import * as dayjs from 'dayjs'
import {useNavigate} from "react-router-dom";

const gender = [
    {
        id: 1,
        label: 'Nam',
    },
    {id: 0, label: 'Nữ'},
];

export default function CreateEmployeePage() {

    const onSubmit = (values) => {
        const navi = useNavigate()
        const date_of_birth = dayjs(values["date_of_birth"]).format("YYYY-MM-DD");
        delete values.avatar;
        delete values["date_of_birth"];
        const formData = new FormData();
        formData.append("avatar", upload)
        formData.append("date_of_birth", date_of_birth)
        Object.keys(values).map(v => {
            formData.append(v, values[v])
        })
        axiosClient.post('/api/users', formData).then(res => navi("/user", {replace: true}))
    }
    const [upload, setUpload] = useState(null)
    return (
        <>
            <Helmet>Thêm mới nhân viên</Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Thêm mới nhân viên
                    </Typography>
                </Stack>
                <Card>
                    <FormContainer
                        onSuccess={(data) => {
                            onSubmit(data);
                        }}
                    >
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-around" mt={5}>
                            <Stack
                                direction="column"
                                alignItems="normal"
                                justifyContent="space-between"
                                spacing={{xs: 1, sm: 2, md: 4}}
                            >
                                <TextFieldElement name="name" label="Tên nhân viên" required/>
                                <SelectElement options={gender} name="is_male" label="Giới tính" required/>
                                <DatePickerElement name="date_of_birth" label="Ngày sinh" format={"YYYY-MM-DD"}/>
                                <TextFieldElement name="address" label="Địa chỉ" required/>
                            </Stack>

                            <Stack
                                direction="column"
                                alignItems="normal"
                                justifyContent="space-around"
                                spacing={{xs: 1, sm: 2, md: 4}}
                            >
                                <TextFieldElement name="phone" label="Số điện thoại" required/>
                                <TextFieldElement name="email" label="Email" required type="email"/>
                                <TextFieldElement name="avatar" type="file"
                                                  onChange={e => setUpload(e.target.files[0])}/>
                            </Stack>
                        </Stack>
                        <Stack direction="column" alignItems="center" justifyContent="center" mt={2} spacing={2}>
                            <SelectElement
                                name="role"
                                label="Chức vụ"
                                options={[
                                    {id: 1, label: 'Quản lý'},
                                    {id: 2, label: 'Nhân viên'},
                                ]}
                                style={{width: 221}}
                            />
                            <TextFieldElement name="password" label="Mật khẩu" type="password" required/>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="center" mb={2} mt={5} spacing={5}>
                            <Button variant="contained" size="large" type="submit">
                                Thêm mới
                            </Button>
                            <ButtonBack/>
                        </Stack>
                    </FormContainer>
                </Card>
            </Container>
        </>
    );
}
