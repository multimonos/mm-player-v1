import { expect, test } from "@playwright/test"
import { History } from "../selectors.js"
import { baseuri } from "../config.js"


test.describe( `History defaults`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
    } )

    // test( `exists`, async ( { page } ) => {
    //     await expect( page.locator( History.root ) ).toBeVisible()
    // } )

    test( `is empty`, async ( { page } ) => {
        await expect( page.locator( History.count(0) ) ).toHaveCount(1)
    } )
} )