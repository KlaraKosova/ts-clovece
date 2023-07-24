export interface HasDTO<Type> {
    getDTO: () => Type
    setDTO: (v: Type) => void
}