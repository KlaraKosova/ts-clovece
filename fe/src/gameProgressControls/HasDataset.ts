export interface HasDataset<Type> {
    getDataset(): Type
    
    setDataset(v: Type): void
}