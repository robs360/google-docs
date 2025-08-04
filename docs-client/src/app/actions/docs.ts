'use server';

export async function getAllDocs(token:string | null) {
  try {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const data = await response.json();
    return {
      ownedDocs: data.ownedDocs || [],
      sharedDocs: data.sharedDocs || [],
      error: null
    };
  } catch (error) {
    return {
      ownedDocs: [],
      sharedDocs: [],
      error: 'Failed to fetch documents'
    };
  }
}