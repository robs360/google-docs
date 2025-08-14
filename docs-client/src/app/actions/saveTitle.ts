'use server'

export const saveDocumentTitle = async (
    title: string,
    id: string,
    token: string | null
) => {
    
    try {
        
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/title/${id}`,
            {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ title }),
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to save document title: ${response.statusText}`)
        }

        const data = await response.json()
        return { success: true, data }
    } catch (error) {
        console.error('Error saving document title:', error)
        return { success: false, error: (error as Error).message }
    }
}
