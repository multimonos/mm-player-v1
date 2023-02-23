import { expect, test } from "@playwright/test"
import { Queue } from "../selectors.js"
import { baseuri } from "../config.js"


test.describe( `Queue defaults`, () => {
    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
    } )

    test( `state is "idle"`, async ( { page } ) => {
        await page.locator( Queue.state( 'idle' ) )
    } )
    test( `exists`, async ( { page } ) => {
        await expect( page.locator( Queue.root ) ).toBeVisible()
    } )
    test( `is empty`, async ( { page } ) => {
        await expect( page.locator( Queue.empty ) ).toBeVisible()
    } )

    test.describe( `footer button`, () => {
        test( `is visible`, async ( { page } ) => {
            await expect( page.locator( Queue.button ) ).toBeVisible()
        } )
        test( `is pulsing`, async ( { page } ) => {
            await expect( page.locator( Queue.button ) ).toBeVisible()
        } )
    } )
} )