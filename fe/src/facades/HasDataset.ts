export interface HasDataset<Dataset extends Record<string, any>> {
    getDataset(): Dataset,
    setDataset(dataset: Dataset): void
}