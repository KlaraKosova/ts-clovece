class PromiseInspector {
    private readonly queue: Array<Promise<any>> = []
    private static instance: PromiseInspector | null = null

    private constructor() {
    }

    public static getInstance(): PromiseInspector {
        if (!PromiseInspector.instance) {
            PromiseInspector.instance = new PromiseInspector()
        }

        return PromiseInspector.instance
    }

    public async add(p: Promise<any>, label: string = ''): Promise<void> {
        this.queue.push(p)
        p.then(
            (val: any) => {
                const index = this.queue.indexOf(p)
                this.queue.splice(index, 1)
            })
            .catch((e) => {
                const index = this.queue.indexOf(p)
                this.queue.splice(index, 1)
            })

        return await p
    };

    public async waitForAll(): Promise<void> {
        console.log('wait for all')
        console.log(JSON.parse(JSON.stringify(this.queue)))

        await Promise.all(this.queue)
    }
}

export const PromiseInspectorInstance = PromiseInspector.getInstance()
