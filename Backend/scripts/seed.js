import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

import Product from "../models/Product.js";
import Manufacturer from "../models/Manufacturer.js";
import Contact from "../models/Contact.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const CONTACTS_COUNT_RANGE = [30, 30];
const PRODUCTS_COUNT_RANGE = [50, 300];
const PRODUCTS_PRICE_RANGE = [10, 200];
const PRODUCTS_STOCK_RANGE = [0, 1000];

const LOW_STOCK = 10;
const CRITICAL_STOCK = 5;

function randomizeItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomizeInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function weightedrandomizeInt(min, max, skew = 2) {
  // Skew > 1 favors lower numbers, e.g. 2 = quadratic, 3 = cubic
  const rand = Math.pow(Math.random(), skew);
  return Math.floor(rand * (max - min + 1)) + min;
}

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
  const contacts = Array.from({
    length: randomizeInt(CONTACTS_COUNT_RANGE[0], CONTACTS_COUNT_RANGE[1]),
  }).map(() => {
    const genName = faker.person.fullName().replace(".", "");
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

  // Skapa ett företag per kontakt
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

  let allProducts = [];

  // Skapa x antal produkter per företag
  for (const manufacturer of manufacturers) {
    const productsCount = randomizeInt(
      PRODUCTS_COUNT_RANGE[0],
      PRODUCTS_COUNT_RANGE[1]
    );

    const products = Array.from({ length: productsCount }).map(() => {
      // SKU logik
      const sku1 = manufacturer.name.slice(0, 3).toUpperCase();
      const sku2 = faker.string.alphanumeric({ length: 8 }).toUpperCase();

      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        // category: randomizeItem([""]),
        manufacturer: manufacturer._id,
        sku: `${sku1}-${sku2}`,
        price: randomizeInt(PRODUCTS_PRICE_RANGE[0], PRODUCTS_PRICE_RANGE[1]),
        amountInStock: weightedrandomizeInt(
          PRODUCTS_STOCK_RANGE[0],
          PRODUCTS_STOCK_RANGE[1],
          2
        ),
      };
    });

    allProducts = [...allProducts, ...products];
  }

  // Se till att det garanterat finns produkter med LOW_STOCK och CRITICAL_STOCK
  if (allProducts.length >= 2) {
    const lowStockIndex = randomizeInt(0, allProducts.length - 1);
    let criticalStockIndex = randomizeInt(0, allProducts.length - 1);
    // Se till att inte plocka samma produkt
    while (criticalStockIndex === lowStockIndex) {
      criticalStockIndex = randomizeInt(0, allProducts.length - 1);
    }
    allProducts[lowStockIndex].amountInStock = LOW_STOCK;
    allProducts[criticalStockIndex].amountInStock = CRITICAL_STOCK;
  }

  const dbProducts = await Product.insertMany(allProducts, { ordered: false });

  console.log(dbProducts);

  console.log("Database has been seeded!");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
