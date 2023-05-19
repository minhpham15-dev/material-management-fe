// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Quản lý nhân viên',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Quản lý nguyên vật liệu',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Quản lý nhà cung cấp',
    path: '/dashboard/suppliers',
    icon: icon('ic_cart'),
  },
  {
    title: 'Danh sách hóa đơn bán',
    path: '/dashboard/invoices-list',
    icon: icon('ic_cart'),
  },
  {
    title: 'Danh sách hóa đơn nhập',
    path: '/dashboard/input-invoices-list',
    icon: icon('ic_cart'),
  },
  {
    title: 'Tạo hóa đơn bán',
    path: '/dashboard/invoice',
    icon: icon('ic_cart'),
  },

  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'Đăng nhập',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
