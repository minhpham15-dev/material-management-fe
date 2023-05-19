import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

const inputInvoiceList = [...Array(24)].map(() => ({
  id: faker.datatype.uuid(),
  idInvoice: faker.datatype.string(5),
  createdAt: '01/01/1970',
  supplier: faker.company.name(1),
  deliverName: faker.name.fullName(),
  paymentMethod: sample(['Chuyển khoản', 'Tiền mặt']),
  total: faker.datatype.number(),
}));
export default inputInvoiceList;
