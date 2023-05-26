// component
import SvgColor from '../../../components/svg-color';
import {Role} from "../../../utils/role";

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const role = localStorage.getItem("role")

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  // },
    ... role === Role.ADMIN ? [{
    title: 'Quản lý nhân viên',
    path: '/user',
    icon: icon('ic_user'),
  }] : [],
  {
    title: 'Quản lý nguyên vật liệu',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Quản lý nhà cung cấp',
    path: '/suppliers',
    icon: icon('ic_cart'),
  },
  {
    title: 'Danh sách hóa đơn bán',
    path: '/invoices-list',
    icon: icon('ic_cart'),
  },
  {
    title: 'Danh sách hóa đơn nhập',
    path: '/input-invoices-list',
    icon: icon('ic_cart'),
  },
  {
    title: 'Tạo hóa đơn bán',
    path: '/invoice',
    icon: icon('ic_cart'),
  },
  {
    title: 'Tạo hóa đơn nhập',
    path: '/input-invoice',
    icon: icon('ic_cart'),
  },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'Đăng nhập',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
