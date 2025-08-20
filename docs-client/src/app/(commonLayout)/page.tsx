'use client'
import AllDocs from "@/components/AllDocs/AllDocs";
import CreateDocs from "@/components/CreateDocs/CreateDocs";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
export default function Home() {
  const [token, setToken] = useState('')
  const router = useRouter()
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login"); // Redirect inside useEffect
    } else {
      setToken(storedToken);
    }
  }, [router]);

  // While checking token, avoid rendering the protected UI
  if (token === null) {
    return null; // or a loading spinner
  }
  return (
    <div>
      <CreateDocs></CreateDocs>
      <div className="mt-12">
        <AllDocs></AllDocs>
      </div>
    </div>
  );
}
