import { faker } from '@faker-js/faker';

const invoiceList = [...Array(24)].map(() => ({
  id: faker.datatype.uuid(),
  idInvoice: faker.datatype.string(5),
  createdAt: '01/01/1970',
  customerName: faker.name.fullName(),
  customerPhone: faker.phone.number('+84 #########'),
  total: faker.datatype.number(),
}));

export default invoiceList;
