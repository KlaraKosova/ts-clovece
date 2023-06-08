export function createElement<Type extends HTMLElement>(tag: keyof HTMLElementTagNameMap, classes: string[], text: string, dataset?: Record<string, string>) {
    const element = document.createElement(tag) as Type
    element.classList.add(...classes)
    element.textContent = text

    if (dataset) {
        Object.entries(dataset).forEach(([key, val]) => {
            element.dataset[key] = val
        })
    }

    return element
}