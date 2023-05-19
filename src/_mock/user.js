import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  address: faker.address.city(),
  phoneNumber: faker.phone.number(),
  dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toDateString(),
  role: sample(['Nhân viên']),
}));

export default users;
