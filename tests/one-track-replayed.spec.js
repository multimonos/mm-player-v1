import { expect, test } from "@playwright/test"
import { History, NowPlaying, Queue, States, Tracks, Transport } from "./selectors.js"
import { baseuri } from "./config.js"


test.describe( `Replay one track`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
        // queue one
        const track = await page.click( Tracks.image1 )
        // play one
        await page.locator( Transport.play ).click()
        await page.locator( States.player( 'paused' ) )
        // play one again
        await page.locator( Transport.play ).click()
        await page.locator( States.player( 'playing' ) )
    } )

    test.describe( `Queue`, () => {
        test( `have length 1`, async ( { page } ) => {
            await expect( page.locator( Queue.count( 1 ) ) ).toHaveCount( 1 )
        } )
    } )

    test.describe( `Now Playing`, () => {
        test( `has length 1`, async ( { page } ) => {
            await expect( page.locator( NowPlaying.items ) ).toHaveCount( 1 )
        } )
    } )

    test.describe( `History`, () => {
        test( `empty`, async ( { page } ) => {
            await expect( page.locator( History.count( 0 ) ) ).toHaveCount( 1 )
        } )
    } )

    test.describe( `Transport`, () => {
        test( `previous enabled`, async ( { page } ) => {
            await expect( page.locator( Transport.previous ) ).toBeEnabled()
        } )
        test( `loading hidden`, async ( { page } ) => {
            await expect( page.locator( Transport.loading ) ).toBeHidden()
        } )
        test( `play hidden`, async ( { page } ) => {
            await expect( page.locator( Transport.play ) ).toBeHidden()
        } )
        test( `pause enabled`, async ( { page } ) => {
            await expect( page.locator( Transport.pause ) ).toBeEnabled()
        } )
        test( `next disabled`, async ( { page } ) => {
            await expect( page.locator( Transport.next ) ).toBeDisabled()
        } )
    } )
} )