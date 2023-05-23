import { Helmet } from 'react-helmet-async';
import { Box, Button, Card, Container, Stack, TextField, Typography } from '@mui/material';
import Iconify from '../components/iconify';

export default function CreateSupplierPage() {
  console.log('success');
  return (
    <>
      <Helmet>
        <title>Thêm mới nhà cung cấp</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Nhà cung cấp
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm nhà cung cấp
          </Button>
        </Stack>

        <Card>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField required id="name" label="Tên nhà cung cấp" />
            </div>
          </Box>
        </Card>
      </Container>
    </>
  );
}
