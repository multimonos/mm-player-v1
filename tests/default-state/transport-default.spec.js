import { expect, test } from "@playwright/test"
import { Transport } from "../selectors.js"
import { baseuri } from "../config.js"


test.describe( `Transport defaults`, () => {
    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
    } )

    test( `play is disabled`, async ( { page } ) => {
        const play = await page.locator( Transport.play )
        await expect( play ).toBeVisible()
        await expect( play ).toBeDisabled()
    } )
    test( `next is disabled`, async ( { page } ) => {
        const next = await page.locator( Transport.next )
        await expect( next ).toBeVisible()
        await expect( next ).toBeDisabled()
    } )
    test( `previous is disabled`, async ( { page } ) => {
        const previous = await page.locator( Transport.previous )
        await expect( previous ).toBeDisabled()
        await expect( previous ).toBeDisabled()
    } )
    test( `pause not visible`, async ( { page } ) => {
        await expect( page.locator( Transport.pause ) ).not.toBeVisible()
    } )
    test( `loading not visible`, async ( { page } ) => {
        await expect( page.locator( Transport.loading ) ).not.toBeVisible()
    } )
} )