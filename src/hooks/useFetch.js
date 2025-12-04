import { useCallback } from 'react';
const useFetch = () => {
    const executeFetch = useCallback(async (endpoint, options = {}) => {
        try {
            const response = await fetch(endpoint, options);

            if (!response.ok) {
                throw new Error(`مشکل در ارتباط با سرور. کد: ${response.status}`);
            }

            let resultData = null; 

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                resultData = await response.json();
            } else if (options.method === 'PUT' || options.method === 'PATCH') {
                try {
                    resultData = JSON.parse(options.body);
                } catch (e) {
                    resultData = JSON.parse(options.body); 
                }
            }
            
            return { success: true, data: resultData };

        } catch (err) {
            console.error("خطای Fetch:", err.message);
            return { success: false, error: err.message };

        }
    }, []); 

    return { executeFetch }; 
};

export default useFetch;