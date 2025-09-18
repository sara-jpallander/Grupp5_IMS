import { Button } from "../components/ui/button";

export default function Manufacturers() {
  const manufacturers = [
    {
      name: "IKEA",
      contact: {
        name: "Ingvar",
        email: "ingvar@ikea.se",
        phone: "+461111111"
      }
    },
    {
      name: "ELON",
      contact: {
        name: "Hasse",
        email: "hasse@elon.se",
        phone: "+6131313131"
      }
    }
  ];
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex gap-4 justify-between">
        <h1 className="text-4xl font-bold mb-4">Manufacturers</h1>
        <Button>+ New manufacturer</Button>
      </div>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente odit,
        fugiat, quae maxime dolor officiis ab optio esse repellendus libero
        adipisci quasi similique et numquam beatae! In laudantium eius ex?
      </p>

      <div className="flex gap-2 my-4">
        <div className="border-1 w-full max-w-xl p-2">Search...</div>
        <Button variant="secondary">Sök</Button>
      </div>

      <div className="">
      Filter: Country | 
      </div>

      <div className="flex flex-col gap-2 mt-6">
        {
          manufacturers.map(m => (
            <div className="border-1 p-6 flex gap-2 justify-between">
              <div>
                <div className="rounded-full bg-red-500 h-[100px] w-[100px] flex items-center justify-center">Logga</div>
              </div>
              <div>{m.name}</div>
              <div>{m.contact.name}: {m.contact.email} {m.contact.phone}</div>
              <Button>Show products (50)</Button>
            </div>
          ))
        }

        [Pagination: Previous | Page 1 | Page 2 | Next]
      </div>
    </div>
  );
}
