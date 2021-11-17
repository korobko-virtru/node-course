const compareFn = (order = 'asc', by = 'title' ) => (f:any, s:any) => {
    if (f[by] > s[by]) return order === 'asc' ? 1 : -1;
    if (f[by] < s[by]) return order === 'asc' ? -1 : 1;
    return 0;
}

export default function (data: any[], sortOrder: string, sortBy: string) {
    if (sortOrder === undefined && sortBy === undefined) {
        return data;
    }

    return data.sort(compareFn(sortOrder, sortBy))
}