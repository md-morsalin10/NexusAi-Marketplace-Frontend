const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const serverMutation = async (data) => {
    try {
        const res = await fetch(`${baseUrl}/api/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            cache: 'no-store'
        });
        
        if (!res.ok) {
            console.error("Backend Error:", res.statusText);
            return null;
        }
        
        return await res.json();
    } catch (error) {
        console.error("Server Mutation Fetch Failed:", error);
        return null;
    }
};