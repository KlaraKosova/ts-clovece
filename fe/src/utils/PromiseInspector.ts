class PromiseInspector {
    private queue: Promise<any>[] = []
    private static instance: PromiseInspector | null = null

    private constructor () {
    }

    public static getInstance() {
        if (!PromiseInspector.instance) {
            PromiseInspector.instance = new PromiseInspector()
        }

        return PromiseInspector.instance
    }

    public add(p: Promise<any>, label: string = '') {
        this.queue.push(p);
        p.then(
            (val: any)  => {
                const index = this.queue.indexOf(p)
                this.queue.splice(index, 1)
            })
            .catch((e) => {
                const index = this.queue.indexOf(p)
                this.queue.splice(index, 1)
            })

        return p;
    };

    public async waitForAll() {
        console.log('wait for all');
        console.log(JSON.parse(JSON.stringify(this.queue)));
        
        return new Promise<void>(async (resolve) => {
            await Promise.all(this.queue)
            resolve()
        })
    }
}

export const PromiseInspectorInstance = PromiseInspector.getInstance()