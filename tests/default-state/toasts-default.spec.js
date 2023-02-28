import { expect, test } from "@playwright/test"
import { Toasts } from "../selectors.js"
import { baseuri } from "../config.js"


test.describe( `Toasts defaults`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
    } )

    test( `state is "idle"`, async ( { page } ) => {
        await expect( page.locator( Toasts.state( 'idle' ) ) ).toHaveCount(1)
    } )

    test( `is empty`, async ( { page } ) => {
        await expect( page.locator( Toasts.count ) ).toHaveValue('0')
    } )


} )