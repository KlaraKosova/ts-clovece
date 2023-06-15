type ElementState = {
    tag: keyof HTMLElementTagNameMap
    content: string
    classList: string[]
    dataset?: Record<string, string>
}

export type ViewModalState = {
    id: string
    headerList: ElementState[]
    containerClasslist: string[]
    contentList: ElementState[]
}
