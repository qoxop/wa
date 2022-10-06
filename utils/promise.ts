
export const resolve = <T>(promise: Promise<T>, timeout?: number) => new Promise<{ result?: T, error?: any }>((resolve) => {
    const id = timeout ? setTimeout(() => {
        resolve({ error: 'timeout~' })
    }, timeout) : null;
    promise.then(val => {
        id && clearTimeout(id);
        resolve({ result: val });
    }).catch(error => {
        id && clearTimeout(id);
        resolve({ error })
    });
})