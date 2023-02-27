import { expect, test } from "@playwright/test"
import { NowPlaying } from "../selectors.js"
import { baseuri } from "../config.js"


test.describe( `Now Playing defaults`, () => {
    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
    } )
    test( `exists`, async ( { page } ) => {
        await expect( page.locator( NowPlaying.root ) ).toHaveCount(1)
    } )
    test( `is empty`, async ( { page } ) => {
        await expect( page.locator( NowPlaying.count(0) ) ).toHaveCount(1)
    } )
} )