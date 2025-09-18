import { Button } from "../components/ui/button";
import { useQuery } from "@apollo/client/react";
import { GET_MANUFACTURERS } from "@/api/graphql";

export default function Manufacturers() {
  const { data: manufacturersData } = useQuery(GET_MANUFACTURERS);
  const manufacturers = manufacturersData?.manufacturers || [];
  
  console.log(manufacturersData);
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Manufacturers</h1>
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
            <div className="border-1 p-6 flex gap-2 justify-between" key={manufacturers.id}>
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
