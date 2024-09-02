export function removeEmptyField(object: any): any {
    return Object.fromEntries(Object.entries(object).filter(([k, v]) => v));
}
