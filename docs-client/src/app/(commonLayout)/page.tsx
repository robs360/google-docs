import AllDocs from "@/components/AllDocs/AllDocs";
import CreateDocs from "@/components/CreateDocs/CreateDocs";


export default function Home() {

  return (
    <div>
      <CreateDocs></CreateDocs>
      <div className="mt-12">
        <AllDocs></AllDocs>
      </div>
    </div>
  );
}
