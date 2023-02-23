import { expect, test } from "@playwright/test"
import { History, NowPlaying, Queue, Tracks, Transport, States } from "./selectors.js"
import {baseuri} from "./config.js"


test.describe( `Completed one track`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( `${baseuri}/state` )
        const track = await page.click( Tracks.image1)
        await page.locator(Transport.play).click()
        await page.locator(States.player('paused'))
    } )

    test.describe( `Queue`, () => {
        test( `empty`, async ( { page } ) => {
            await expect( page.locator( Queue.empty ) ).toBeVisible( )
        } )
    } )

    test.describe( `Now Playing`, () => {
        test( `has length 1`, async ( { page } ) => {
            await expect( page.locator( NowPlaying.items ) ).toHaveCount( 1 )
        } )
    } )

   test.describe( `History`, () => {
        test( `has length 1`, async ( { page } ) => {
            await expect( page.locator( History.items) ).toHaveCount(1)
        } )
    } )

    test.describe( `Transport`, () => {
        test( `previous enabled`, async ( { page } ) => {
            await expect( page.locator( Transport.previous ) ).toBeEnabled()
        } )
        test( `loading hidden`, async ( { page } ) => {
            await expect( page.locator( Transport.loading ) ).toBeHidden()
        } )
        test( `play enabled`, async ( { page } ) => {
            await expect( page.locator( Transport.play ) ).toBeEnabled()
        } )
        test( `pause hidden`, async ( { page } ) => {
            await expect( page.locator( Transport.pause ) ).toBeHidden()
        } )
        test( `next disabled`, async ( { page } ) => {
            await expect( page.locator( Transport.next ) ).toBeDisabled()
        } )
    } )
} )