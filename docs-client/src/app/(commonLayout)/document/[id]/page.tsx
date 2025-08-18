'use client'
import { saveDocumentTitle } from "@/app/actions/saveTitle";
import { ShareModal } from "@/components/ShareModal/ShareModal";
import TipTabEditor from "@/components/TipTabEditor/TipTabEditor"
import axios from "axios";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const DynamicDocument = () => {
    const [title, setTitle] = useState("")
    const [role, setRole] = useState("")
    const [owner, setOwner] = useState("")
    
    const params = useParams();
    
    const id = params?.id as string;
  useEffect(() => {
  const userData = localStorage.getItem("user")
  if (userData) {
    try {
      const user = JSON.parse(userData)
      setOwner(user.email)
    } catch (err) {
      console.error("Failed to parse user data", err)
    }
  }
}, [])
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!id || !storedToken) {
            return;
        }
        const fetchContent = async () => {

            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                        timeout: 1500, // add a timeout to avoid silent hangs
                    }
                );
                
                setRole(response.data.document.owner)
                setTitle(response.data.document.title);

            } catch (error: any) {
                setTitle("");
            }
        };
        fetchContent();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            if (token && title) {
                const response = await saveDocumentTitle(title, id, token)
            }
        }
        fetchData()
    }, [title, id])
    return (
        <div className="space-y-6">
            <div className="flex justify-between flex-col md:flex-row gap-6">
             {role === owner && <ShareModal id={id} />}
                <div>
                    <label className="text-lg text-gray-600 font-medium" htmlFor="">Title: </label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="p-2 lg:w-[300px] border-2 h-[42px] rounded-lg" />
                </div>
            </div>
            <TipTabEditor id={id}></TipTabEditor>
        </div>
    )
}
export default DynamicDocument