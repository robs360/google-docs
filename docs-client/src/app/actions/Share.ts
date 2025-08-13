'use server'
type ShareProps = {
    user: string,
    role: string
}
export const ShareDocs = async ({ id, token, shareData }: { id: string, token: string | null, shareData: ShareProps }) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/${id}/share`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(shareData),
        });

        if (!response.ok) {
            const errorData = await response.json();
           
            return { error: errorData.message || "Failed to share document" };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return { error: "Something went wrong while sharing the document." };
    }

}