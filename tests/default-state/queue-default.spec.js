import { expect, test } from "@playwright/test"
import { Queue } from "../selectors.js"
import { baseuri } from "../config.js"


// strategy is to check the ServiceStatus component value
test.describe( `Queue defaults`, () => {
    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
    } )

    test( `state is "idle"`, async ( { page } ) => {
        await expect( page.locator( Queue.state( 'idle' ) ) ).toHaveCount( 1 )
    } )
    // test( `exists`, async ( { page } ) => { // this is a queue route test
    //     await expect( page.locator( Queue.root ) ).toBeVisible()
    // } )
    test( `is empty`, async ( { page } ) => {
        await expect( page.locator( Queue.count ) ).toHaveValue( '0' )
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