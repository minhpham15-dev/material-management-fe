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

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <EmployeePage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        {
          path: 'suppliers',
          element: <SupplierPage />,
        },
        { path: 'invoices-list', element: <InvoiceListPage /> },
        { path: 'input-invoices-list', element: <InputInvoiceListPage /> },
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
      element: <CreateSupplierPage />,
    },
  ]);

  return routes;
}
