export function createElement<Type extends HTMLElement> (tag: keyof HTMLElementTagNameMap, classes: string[], text?: string, dataset?: Record<string, string>): Type {
    const element = document.createElement(tag) as Type
    element.classList.add(...classes)
    element.innerHTML = text || ''

    if (dataset) {
        Object.entries(dataset).forEach(([key, val]) => {
            element.dataset[key] = val
        })
    }

    return element
}
