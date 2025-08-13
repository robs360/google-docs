'use server'

export const deleteDocs = async (id: string, token: string | null) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error('Failed to delete document');
        }
        const data = await response.json();
        return data
    }
    catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
}