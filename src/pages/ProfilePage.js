import {Helmet} from "react-helmet-async";
import {Card, Container, Stack, Typography} from "@mui/material";

export default function ProfilePage() {
    return (<>
        <Helmet>
            <title>Thông tin cá nhân</title>
        </Helmet>

        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Thông tin cá nhân
                </Typography>
            </Stack>
            <Card />
        </Container>
    </>)
}