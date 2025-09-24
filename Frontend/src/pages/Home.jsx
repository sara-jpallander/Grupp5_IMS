import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import LoadingText from "@/components/LoadingText";
import { GET_CRITICAL_STOCK, STOCK_VALUE_MANUFACTURER } from "@/api/graphql";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: criticalStockData, loading } = useQuery(GET_CRITICAL_STOCK, {
    variables: { limit: 6 },
  });
  const criticalStock = criticalStockData?.criticalStockProducts?.items || [];

  const { data: stockValueManufacturerData, loadingStockManufacturer } =
    useQuery(STOCK_VALUE_MANUFACTURER, {
      variables: { limit: 6 },
    });
  const stockValueManufacturer =
    stockValueManufacturerData?.totalStockValueByManufacturer?.items || [];

  const { data: stockValueData } = useQuery(gql`
    query TotalStockValue {
      totalStockValue
    }
  `);
  const totalStockValue = stockValueData?.totalStockValue || 0;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Industry Management System</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora animi
        neque assumenda sint velit ipsa, a impedit sit? Vel nemo sequi sapiente
        doloremque unde aperiam quia tempora similique labore quam.
      </p>

      <div className="border-1 p-4 my-6 rounded-sm">
        <strong>Total stock value:</strong>{" "}
        {formatCurrency.format(totalStockValue)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="flex flex-col border-1 gap-3 p-4">
          <strong>Top manufacturers</strong>

          {loadingStockManufacturer && <LoadingText />}
          <div>
            <ul className="list">
              {stockValueManufacturer.map((m) => (
                <li
                  key={m.id}
                  className="flex justify-between border-b-1 p-1 py-[.4rem] text-sm text-gray-500"
                >
                  <div>{m.name}</div>
                  <div className="font-semibold">
                    {formatCurrency.format(m.totalStockValue)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/manufacturers"><Button className="w-full">View all manufacturers</Button></Link>
        </div>
        <div className="flex flex-col border-1 gap-3 p-4">
          <strong>Critical stock</strong>

          {loading && <LoadingText />}
          <div className="grid gap-1">
            {criticalStock.map((c) => (
              <div key={c.id} className="flex justify-between border-b-1 p-1">
                <div className="text-gray-500 text-sm">{c.name}</div>
                <Badge className="bg-red-400">{c.amountInStock} in stock</Badge>
              </div>
            ))}
          </div>

          <Link href="/critical-stock"><Button className="w-full">View all critical stock</Button></Link>

        </div>
      </div>
    </div>
  );
}
