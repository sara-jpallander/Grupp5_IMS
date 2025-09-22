import { Separator } from "./ui/separator";

export default function InfoTable({ data }) {
  return (
    <div className="space-y-0 border-1 rounded-sm px-3 py-1 text-sm">
      {data.map(
        (item, index) =>
          item.value && (
            <div key={item.label}>
              <div className="grid grid-cols-[120px_1fr] gap-2 py-[.4rem] px-1">
                <div className="font-medium text-muted-foreground">
                  {item.label}
                </div>
                <div className="break-words">{item.value}</div>
              </div>
              {index < data.filter((f) => f.value).length - 1 && <Separator />}
            </div>
          )
      )}
    </div>
  );
}
