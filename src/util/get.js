export const get = (obj = {}, pathParam = '', defaultValue = undefined) => {
    let path = [];
    if (typeof pathParam === 'string') {
        path = pathParam.split('.') || [];
    } else if (Array.isArray(pathParam)) {
        path = pathParam;
    }

    const value = path.reduce((accumulator, key) => {
        if (accumulator && accumulator.hasOwnProperty(key)) {
            return accumulator[key];
        } else {
            return defaultValue;
        }
    }, obj);

    return value;
}