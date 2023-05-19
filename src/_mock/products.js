import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Nike Air Force 1 NDESTRUKT',
  'Nike Space Hippie 04',
  'Nike Air Zoom Pegasus 37 A.I.R. Chaz Bear',
  'Nike Blazer Low 77 Vintage',
  'Nike ZoomX SuperRep Surge',
  'Zoom Freak 2',
  'Nike Air Max Zephyr',
  'Jordan Delta',
  'Air Jordan XXXV PF',
  'Nike Waffle Racer Crater',
  'Kyrie 7 EP Sisterhood',
  'Nike Air Zoom BB NXT',
  'Nike Air Force 1 07 LX',
  'Nike Air Force 1 Shadow SE',
  'Nike Air Zoom Tempo NEXT%',
  'Nike DBreak-Type',
  'Nike Air Max Up',
  'Nike Air Max 270 React ENG',
  'NikeCourt Royale',
  'Nike Air Zoom Pegasus 37 Premium',
  'Nike Air Zoom SuperRep',
  'NikeCourt Royale',
  'Nike React Art3mis',
  'Nike React Infinity Run Flyknit A.I.R. Chaz Bear',
];
// ----------------------------------------------------------------------

const products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.datatype.uuid(),
    imgUrl: `/assets/images/products/product_${setIndex}.jpg`,
    name: PRODUCT_NAME[index],
    amount: faker.datatype.number(),
    price: faker.datatype.number({ min: 10, max: 100, precision: 0.01 }),
    productType: sample(['Sắt', 'Tôn', 'Thép']),
    tax: faker.datatype.number({ min: 1, max: 10, precision: 0.1 }),
    supplier: faker.company.name(),
  };
});

export default products;
