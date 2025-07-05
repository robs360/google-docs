import axios from "axios"

export const saveDocs = async ({
    id,
    content,
    token
}: {
    id: string
    content: any,
    token?:string
}) => {
   // get token from storage
    
    const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/${id}`,
        {
            content,                    // body data
            title: "Untitled Document" // body data
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )

    return res.data
}
