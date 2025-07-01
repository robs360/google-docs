export const uploadImageToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        return data.data.url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};