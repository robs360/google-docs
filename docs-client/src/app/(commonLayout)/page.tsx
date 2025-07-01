import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


export default function Home() {
  return (
    <div>
      <Button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
        <Plus className="h-4 w-4" />
        New Document
      </Button>
    </div>
  );
}
