import { expect, test } from "@playwright/test"
import { NowPlaying } from "../selectors.js"
import { baseuri } from "../config.js"


test.describe( `Now Playing defaults`, () => {
    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
    } )
    test( `exists`, async ( { page } ) => {
        await expect( page.locator( NowPlaying.root ) ).toBeVisible()
    } )
    test( `is empty`, async ( { page } ) => {
        await expect( page.locator( NowPlaying.empty ) ).toBeVisible()
    } )
} )