import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, Container, Grid, Stack, Typography } from '@mui/material';
// components
// sections
import { AppCurrentVisits, AppWebsiteVisits } from '../sections/@dashboard/app';
import { axiosClient } from '../utils/axiosClient';
import { useEffect, useState } from 'react';
import Iconify from '../components/iconify';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [user, setUser] = useState(0);
  const [supplier, setSupplier] = useState(0);
  const [category, setCategory] = useState(0);
  const getInputStatics = async () => await axiosClient.get('/api/statistics/input');
  const getOutputStatics = async () => await axiosClient.get('/api/statistics/output');
  const getUser = async () => await axiosClient.get('/api/users');
  const getCate = async () => await axiosClient.get('/api/categories');

  const getSupplier = async () => await axiosClient.get('/api/suppliers');

  useEffect(() => {
    getInputStatics().then((res) => console.log(res));
  }, []);

  useEffect(() => {
    getOutputStatics().then((res) => console.log(res));
  }, []);

  useEffect(() => {
    getUser().then((res) => setUser(res.data.meta.total));
    getSupplier().then((res) => setSupplier(res.data.meta.total));
    getCate().then((res) => setCategory(res.data.data.length));
  }, []);
  console.log(category);
  return (
    <>
      <Helmet>
        <title> Home </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Trang chủ
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6} md={4} lg={4}>
            <Card>
              <CardHeader title={'Nhân viên'} style={{ textAlign: 'center' }}></CardHeader>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} mt={2} mb={3}>
                <Iconify icon={'bi:person'} width={40} />
                <h3>{user}</h3>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Card>
              <CardHeader title={'Nhà cung cấp'} style={{ textAlign: 'center' }}></CardHeader>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} mt={2} mb={3}>
                <Iconify icon={'bi:truck'} width={40} />
                <h3>{supplier}</h3>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={6} md={4} lg={4}>
            <Card>
              <CardHeader title={'Sản phẩm'} style={{ textAlign: 'center' }}></CardHeader>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} mt={2} mb={3}>
                <Iconify icon={'bi:box-seam'} width={40} />
                <h3>{category} loại</h3>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Doanh thu theo tháng"
              chartLabels={['01/01/2023', '02/02/2023', '03/03/2023', '04/04/2023', '05/05/2023']}
              chartData={[
                {
                  name: 'Sắt',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13],
                },
                {
                  name: 'Thép',
                  type: 'column',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22],
                },
                // {
                //   name: 'Nhôm',
                //   type: 'area',
                //   fill: 'gradient',
                //   data: [44, 55, 41, 67, 22],
                // },
                {
                  name: 'Tôn',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Số lượng kho"
              chartData={[
                { label: 'Sắt', value: 4344 },
                { label: 'Thép', value: 5435 },
                { label: 'Tôn', value: 1443 },
              ]}
              chartColors={[theme.palette.primary.main, theme.palette.warning.main, theme.palette.error.main]}
            />
          </Grid>

          {/*<Grid item xs={12} md={6} lg={8}>*/}
          {/*  <AppConversionRates*/}
          {/*    title="Conversion Rates"*/}
          {/*    subheader="(+43%) than last year"*/}
          {/*    chartData={[*/}
          {/*      { label: 'Italy', value: 400 },*/}
          {/*      { label: 'Japan', value: 430 },*/}
          {/*      { label: 'China', value: 448 },*/}
          {/*      { label: 'Canada', value: 470 },*/}
          {/*      { label: 'France', value: 540 },*/}
          {/*      { label: 'Germany', value: 580 },*/}
          {/*      { label: 'South Korea', value: 690 },*/}
          {/*      { label: 'Netherlands', value: 1100 },*/}
          {/*      { label: 'United States', value: 1200 },*/}
          {/*      { label: 'United Kingdom', value: 1380 },*/}
          {/*    ]}*/}
          {/*  />*/}
          {/*</Grid>*/}

          {/*<Grid item xs={12} md={6} lg={8}>*/}
          {/*  <AppNewsUpdate*/}
          {/*    title="News Update"*/}
          {/*    list={[...Array(5)].map((_, index) => ({*/}
          {/*      id: faker.datatype.uuid(),*/}
          {/*      title: faker.name.jobTitle(),*/}
          {/*      description: faker.name.jobTitle(),*/}
          {/*      image: `/assets/images/covers/cover_${index + 1}.jpg`,*/}
          {/*      postedAt: faker.date.recent(),*/}
          {/*    }))}*/}
          {/*  />*/}
          {/*</Grid>*/}

          {/*<Grid item xs={12} md={6} lg={4}>*/}
          {/*  <AppOrderTimeline*/}
          {/*    title="Order Timeline"*/}
          {/*    list={[...Array(5)].map((_, index) => ({*/}
          {/*      id: faker.datatype.uuid(),*/}
          {/*      title: [*/}
          {/*        '1983, orders, $4220',*/}
          {/*        '12 Invoices have been paid',*/}
          {/*        'Order #37745 from September',*/}
          {/*        'New order placed #XF-2356',*/}
          {/*        'New order placed #XF-2346',*/}
          {/*      ][index],*/}
          {/*      type: `order${index + 1}`,*/}
          {/*      time: faker.date.past(),*/}
          {/*    }))}*/}
          {/*  />*/}
          {/*</Grid>*/}

          {/*<Grid item xs={12} md={6} lg={4}>*/}
          {/*  <AppTrafficBySite*/}
          {/*    title="Traffic by Site"*/}
          {/*    list={[*/}
          {/*      {*/}
          {/*        name: 'FaceBook',*/}
          {/*        value: 323234,*/}
          {/*        icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  />*/}
          {/*</Grid>*/}
        </Grid>
      </Container>
    </>
  );
}
