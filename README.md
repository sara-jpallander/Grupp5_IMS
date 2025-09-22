# IMS - Grupp 5

**Teknikstack:**
- Node.js
- Express
- MongoDB
- Mongoose
- RESTful API
- GraphQL
- Apollo Server

## Kom igång

### Backend
För att köra backendservern behövs en uppkoppling till en MongoDB-databas. Denna kan anges `.env`-filen i rooten av `Backend/`-mappen under fältet `MONGODB_URI`. Följande är default värden i env-filen om du inte anger något annat:

```env
MONGODB_URI=mongodb://localhost:27017/IMS_DB
FRONTEND_URL=http://localhost:5173
PORT=3002
```

Backend-servern körs igång på default-adressen `http://localhost:3002` genom:

```zsh
npm run dev
```

### Frontend

Frontend kan också köras igång i utvecklingläge med `npm run dev`. Frontend stödjer också en .env-fil, men kommer använda följande inställningar om du inte anger något annat:

```env
VITE_BACKEND_URL=http://localhost:3002
```

### Seeda databas

Från `Backend/`-mappen har du tillgång till följande kommando för att mata in dummy-data i `IMS_DB`-databasen:

```zsh
npm run db:seed
```

Längst upp i fiilen `Backend/scripts/seed.js` finns det konfigurationsvariabler där du kan ställa in hur många tillverkare/kontaker och produkter som skall skapas. **OBS! Seeden rensar allt innehåll i databasen varje gång den körs.**

```js
const CONTACTS_COUNT_RANGE = [30, 30]; # Generera mellan X och Y antal kontakter/tillverkare
const PRODUCTS_COUNT_RANGE = [50, 300]; # Antal produkter per tillverkare
const PRODUCTS_PRICE_RANGE = [10, 200]; # Produktpris
const PRODUCTS_STOCK_RANGE = [0, 1000]; # Produktens lagerantal

const LOW_STOCK = 10; # gränsen för lågt lagerantal för produkter
const CRITICAL_STOCK = 5; # gränsen för kritiskt lagerantal för produkter
```
