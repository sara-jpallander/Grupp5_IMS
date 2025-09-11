import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

import Product from "../models/Product.js";
import Manufacturer from "../models/Manufacturer.js";
import Contact from "../models/Contact.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const CONTACTS_COUNT = 5;
const PRODUCTS_COUNT = 5;

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  await mongoose.connect(MONGODB_URI, {
    dbName: "IMS_DB",
  });
  console.log("Connected:", MONGODB_URI);

  // Rensa databas
  await Promise.all([
    Product.deleteMany({}),
    Manufacturer.deleteMany({}),
    Contact.deleteMany({}),
  ]);

  // Skapa kontakter
  const contacts = Array.from({ length: CONTACTS_COUNT }).map(() => {
    const genName = faker.person.fullName();
    const [firstName, lastName] = genName.split(" ");
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mail.com`;

    return {
      name: genName,
      email: email,
      phone: faker.phone.number({ style: "international" }),
    };
  });
  const contactDocs = await Contact.insertMany(contacts, { ordered: false });

  let manufacturers = [];

  for (const contact of contactDocs) {
    const genName = faker.company.name();
    const genWebsiteDomain = genName.split(" ").join("").replace(",", "");

    const genData = {
      name: genName,
      country: faker.location.country(),
      website: `www.${genWebsiteDomain.toLocaleLowerCase()}.com`,
      description: faker.company.catchPhrase(),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
      contact: contact._id,
    };

    manufacturers.push(genData);
  }

  manufacturers = await Manufacturer.insertMany(manufacturers, {
    ordered: false,
  });

  const products = Array.from({ length: PRODUCTS_COUNT }).map(() => {
    const manufacturer = rand(manufacturers);

      // Gör klart alla fält
      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        manufacturer: manufacturer._id
      }
  });

  const dbProducts = await Product.insertMany(products, { ordered: false });

  console.log(dbProducts)


  // for (const manufacturer of manufacturers) {
  //   products = Array.from({ length: PRODUCT_PER_MANUFACTURER_COUNT }).map(() => {
  //     return {
  //       name: faker.commerce.productName(),
  //       description: faker.commerce.productDescription(),
  //       category: faker.commerce.department(),
  //       manufacturer: manufacturer._id
  //     }
  //   });
  // }
  // console.log(manufacturers)
  // console.log(products)

  // await Product.insertMany(products, { ordered: false });

  console.log("Database has been seeded!");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
