import {Button, Card, Container, Stack, Typography} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {axiosClient} from "../utils/axiosClient";
import {useEffect, useState} from "react";

export const DetailSupplier = ({data, setOpenModal}) => {
    const [currentSupplier, setCurrentSupplier] = useState(null)
    const onSubmit = (values) => {
        axiosClient.patch(`/api/suppliers/${data}`, values).then(res => setOpenModal(false))
    }
    useEffect(()  => {
        axiosClient.get(`/api/suppliers/${data}`).then(res => setCurrentSupplier(res.data.data))
    },[data])
    const formContext = useForm({
        defaultValues: {
            name: currentSupplier?.name || "",
            email: currentSupplier?.email || "",
            phone: currentSupplier?.phone || "",
            tax_code: currentSupplier?.tax_code || "",
            representative: currentSupplier?.representative || "",
            representative_phone: currentSupplier?.representative_phone || ""
        }
    });
    useEffect(()=> {
        formContext.setValue("name", currentSupplier?.name || "")
        formContext.setValue("email", currentSupplier?.email || "")
        formContext.setValue("phone", currentSupplier?.phone || "")
        formContext.setValue("tax_code", currentSupplier?.tax_code || "")
        formContext.setValue("representative", currentSupplier?.representative || "")
        formContext.setValue("representative_phone", currentSupplier?.representative_phone || "")
    }, [currentSupplier])
    return <>
        <Container style={{transform: 'translate(0%, 50%)'}}>
            <Card>
                <Stack>
                    <Typography variant="h4" ml={5} mt={2} gutterBottom>
                        Chi tiết Nhà cung cấp
                    </Typography>
                </Stack>
                <FormContainer
                    formContext={formContext}
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
                            <TextFieldElement name="name" label="Tên nhà cung cấp" required/>
                            <TextFieldElement name="email" label="Email" required/>
                            <TextFieldElement name="phone" label="Số điện thoại" required/>
                        </Stack>

                        <Stack
                            direction="column"
                            alignItems="normal"
                            justifyContent="space-around"
                            spacing={{xs: 1, sm: 2, md: 4}}
                        >
                            <TextFieldElement name="tax_code" label="Mã số thuế" required/>
                            <TextFieldElement name="representative" label="Người đại diện" required/>
                            <TextFieldElement name="representative_phone" label="Số điện thoại người đại diện"
                                              required/>
                        </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent="end" mb={2} mt={5} mr={10} spacing={5}>
                        <Button variant="contained" size="large" type="submit"
                                disabled={!formContext.formState.isDirty}>
                            Sửa
                        </Button>
                    </Stack>
                </FormContainer>
            </Card>
        </Container></>
}