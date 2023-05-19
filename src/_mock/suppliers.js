import { faker } from '@faker-js/faker';

const suppliers = [...Array(24)].map(() => ({
  id: faker.datatype.uuid(),
  name: faker.company.name(),
  address: faker.address.city(),
  taxCode: faker.datatype.number(),
  representative: faker.name.fullName(),
}));

export default suppliers;
