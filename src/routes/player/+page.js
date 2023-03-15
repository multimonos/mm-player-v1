import { createMeta } from "$lib/model/meta-factory.js"


export const load = async () => {
    return {
        meta: createMeta( [
            { name: 'title', content: 'Player | multimonos' }
        ] ),
    }
}