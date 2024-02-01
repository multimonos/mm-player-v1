import { createTests } from "./test-helper.js";

export const load = async () => {

    const tests = await createTests()

    return {
        tests,
    }
}