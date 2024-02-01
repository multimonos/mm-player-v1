import { createTest, createTests } from "../test-helper.js";

export const load = async ( { params } ) => {

    const tests = await createTests()

    const tid = params.tid || "not-found"

    return {
        tid,
        tests,
    }
}