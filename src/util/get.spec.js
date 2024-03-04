import { get } from './get';

describe('get', () => {
    const TEST_OBJECT = {
        a: {
            b: {
                c: 1
            }
        }
    };

    it('should get proper value from object by given path', () => {
        expect(get(TEST_OBJECT, 'a.b.c')).toBe(1);
    });

    it('should return the value at the given path', () => {
        const obj = TEST_OBJECT;
        const path = 'a.b.c';
        const result = get(obj, path);
        expect(result).toEqual(1);
    });

    it('should return undefined if the path does not exist', () => {
        const obj = TEST_OBJECT;
        const path = 'a.b.d';
        const result = get(obj, path);
        expect(result).toBeUndefined();
    });

    it('should return undefined if the object is null', () => {
        const obj = null;
        const path = 'a.b.c';
        const result = get(obj, path);
        expect(result).toBeUndefined();
    });

    it('should return default value if the path does not exist', () => {
        const obj = TEST_OBJECT;
        const path = 'a.b.d';
        const defaultValue = 'default';
        const result = get(obj, path, defaultValue);

        expect(result).toEqual(defaultValue);
    });

    it('should work with array path', () => {
        const obj = TEST_OBJECT;
        const path = ['a', 'b', 'c'];
        const result = get(obj, path);
        expect(result).toEqual(1);
    });
});
