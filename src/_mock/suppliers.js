import { faker } from '@faker-js/faker';

const suppliers = [...Array(24)].map(() => ({
  id: faker.datatype.uuid(),
  name: faker.company.name(),
  email: faker.name.lastName() + '@mail.com',
  phone: faker.phone.number(),
  tax_code: faker.datatype.number(),
  representative: faker.name.fullName(),
  representative_phone: faker.phone.number(),
}));

export default suppliers;
