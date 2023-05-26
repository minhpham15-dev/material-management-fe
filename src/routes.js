import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import EmployeePage from './pages/EmployeePage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import SupplierPage from './pages/SupplierPage';
import InvoiceListPage from './pages/InvoiceListPage';
import InputInvoiceListPage from './pages/InputInvoiceListPage';
import InvoicePage from './pages/InvoicePage';
import CreateSupplierPage from './pages/CreateSupplierPage';
import CreateProductPage from './pages/CreateProductPage';
import CreateEmployeePage from './pages/CreateEmployeePage';
import InputInvoicePage from "./pages/InputInvoicePage";
import {Role} from "./utils/role";

// ----------------------------------------------------------------------

export default function Router() {
  const role = localStorage.getItem("role")
  const token = localStorage.getItem("token")
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: token ? <DashboardLayout /> :<Navigate to="/login"/>,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
          ... role === Role.ADMIN ? [{ path: 'user', element: <EmployeePage /> }]  : [],
        // { path: 'user', element: <EmployeePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        {
          path: 'suppliers',
          element: <SupplierPage />,
          // children: [
          //   {
          //     path: 'create-supplier',
          //     element: <CreateSupplierPage />,
          //   },
          // ],
        },
        { path: 'invoices-list', element: <InvoiceListPage /> },
        { path: 'input-invoices-list', element: <InputInvoiceListPage /> },
        { path: 'input-invoice', element: <InputInvoicePage /> },
        { path: 'invoice', element: <InvoicePage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: 'create-supplier',
      element:token ? <CreateSupplierPage /> :<Navigate to="/login"/>,
    },
    {
      path: 'create-product',
      element: token ? <CreateProductPage /> :<Navigate to="/login"/>,
    },
    {
      path: 'create-employee',
      element: (token && role) === Role.ADMIN ? <CreateEmployeePage /> :<Navigate to="/login"/>,
    },
  ]);

  return routes;
}
