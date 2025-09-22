import clsx from "clsx";
import { LoaderCircle } from "lucide-react";

export default function LoadingText({ label = "Loading...", className }) {
  return (
    <div className={clsx("flex items-center justify-center text-center gap-2 text-gray-500", className)}>
      <span className="animate-spin">
        <LoaderCircle />
      </span>{" "}
      {label}
    </div>
  );
}
