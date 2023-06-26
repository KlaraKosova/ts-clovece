interface ElementState {
    tag: keyof HTMLElementTagNameMap
    content: string
    classList: string[]
    dataset?: Record<string, string>
}

export interface ViewModalState {
    id: string
    headerList: ElementState[]
    containerClasslist: string[]
    contentList: ElementState[]
}
