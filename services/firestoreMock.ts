// FIX: Add mock implementations for firestore functions to allow legacy React components to compile.
// Since the React views are legacy and not currently used,
// a simple mock that returns empty data is sufficient.

export const onSnapshot = <T>(collection: string, callback: (data: T[]) => void): (() => void) => {
    // Call the callback with an empty array to prevent runtime errors in components.
    console.log(`Firestore mock: onSnapshot called for collection '${collection}'. Returning empty data.`);
    callback([]);
    
    // Return a dummy unsubscribe function.
    return () => {};
};

export const getDoc = async <T>(collection: string, id: string): Promise<T | null> => {
    // Return null as if the document was not found.
    console.log(`Firestore mock: getDoc called for collection '${collection}' with id '${id}'. Returning null.`);
    return Promise.resolve(null);
};
