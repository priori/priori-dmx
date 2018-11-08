export function keys(a: any, b: any) {
    const k1 = Object.keys(a).concat(Object.keys(b));
    const keys = k1.filter((k, i) => k1.indexOf(k) == i);
    return keys;
}

export function deepEquals(a: any, b: any) {
    if (a === b) return true;
    if ((a && !b) || (!a && b)) return false;
    if (typeof a == "object" && typeof b == "object") {
        for (const i of keys(a, b)) {
            if (!deepEquals(a[i], b[i])) return false;
        }
        return true;
    }
    if ( a != a && b != b)
        return true;
    return false;
}
