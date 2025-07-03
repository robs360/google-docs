'use client'
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
const CreateDocs = () => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState('')

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            setEmail(user.email);
        }
    }, []);
    const createNewDocument = async () => {
        try {
            
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/create`,
                { title: 'Untitled Document', owner: email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            router.push(`/document/${res.data._id}`);

        } catch (err) {
            router.push('/login')
            alert('Error creating document');
        }
    };

    return (
        <div>
            <Button onClick={createNewDocument} className="rounded h-36 cursor-pointer flex flex-col justify-center md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100">
                <Plus className="h-4 w-4" />
                New Document
            </Button>
        </div>
    )
}
export default CreateDocs