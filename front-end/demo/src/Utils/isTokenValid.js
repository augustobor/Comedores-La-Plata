async function isTokenValid(jwt, removeTokenFunction) {
    if (!jwt) return false;

    try {
        const response = await fetch(`/api/auth/validate?token=${jwt}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (response.ok) {
            const result = await response.json();
            if (result.valid) {
                return true;
            } else {
                removeTokenFunction();
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error en la validación del token UWU:", error);
        removeTokenFunction();
        return false;
    }
}


export { isTokenValid };
