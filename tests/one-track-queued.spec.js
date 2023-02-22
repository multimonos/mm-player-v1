import { expect, test } from "@playwright/test"
import { History, NowPlaying, Queue, Tracks, Transport } from "./selectors.js"


test.describe( `Queue one track`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( "/testing" )
        const track = await page.click( Tracks.image1 )
    } )

    test.describe( `Queue`, () => {
        test( `has length 1`, async ( { page } ) => {
            await expect( page.locator( Queue.items ) ).toHaveCount( 1 )
        } )
    } )

    test.describe( `History`, () => {
        test( `is empty`, async ( { page } ) => {
            await expect( page.locator( History.empty ) ).toBeVisible()
        } )
    } )

    test.describe( `Now Playing`, () => {
        test( `is empty`, async ( { page } ) => {
            await expect( page.locator( NowPlaying.empty ) ).toBeVisible()
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