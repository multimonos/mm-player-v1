import { expect, test } from "@playwright/test"
import { History, NowPlaying, Queue, Tracks, Transport } from "./selectors.js"
import { baseuri } from "./config.js"


test.describe( `Queue one track`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
        const track = await page.click( Tracks.image1 )
    } )

    test.describe( `Queue`, () => {
        test( `has length 1`, async ( { page } ) => {
            await expect( page.locator( Queue.count( 1 ) ) ).toHaveCount( 1 )
        } )
    } )

    test.describe( `History`, () => {
        test( `is empty`, async ( { page } ) => {
            await expect( page.locator( History.count( 0 ) ) ).toHaveCount( 1 )
        } )
    } )

    test.describe( `Now Playing`, () => {
        test( `is empty`, async ( { page } ) => {
            await expect( page.locator( NowPlaying.count(0) ) ).toHaveCount(1)
        } )
    } )

    test.describe( `Transport`, () => {
        test( `previous disabled`, async ( { page } ) => {
            await expect( page.locator( Transport.previous ) ).toBeDisabled()
        } )
        test( `play enabled`, async ( { page } ) => {
            await expect( page.locator( Transport.play ) ).toBeEnabled()
        } )
        test( `next enabled`, async ( { page } ) => {
            await expect( page.locator( Transport.next ) ).toBeEnabled()
        } )
        test( `pause not visible`, async ( { page } ) => {
            await expect( page.locator( Transport.pause ) ).not.toBeVisible()
        } )
        test( `loading not visible`, async ( { page } ) => {
            await expect( page.locator( Transport.loading ) ).not.toBeVisible()
        } )
    } )
} )