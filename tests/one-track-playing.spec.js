import { expect, test } from "@playwright/test"
import { History, NowPlaying, Queue, Tracks, Transport, Player } from "./selectors.js"
import {baseuri} from "./config.js"


test.describe( `Playing one track`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri)
        const track = await page.click( Tracks.image1)
        await page.locator(Transport.play).click()
        await expect(page.locator(Player.state)).toHaveValue('playing')
    } )

    test.describe( `Queue`, () => {
        test( `has length 1`, async ( { page } ) => {
            await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        } )
    } )

    test.describe( `Now Playing`, () => {
        test( `has length 1`, async ( { page } ) => {
            await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        } )
    } )

   test.describe( `History`, () => {
        test( `is empty`, async ( { page } ) => {
            await expect( page.locator( History.count ) ).toHaveValue('0')
        } )
    } )

    test.describe( `Transport`, () => {
        test( `previous disabled`, async ( { page } ) => {
            await expect( page.locator( Transport.previous ) ).toBeDisabled()
        } )
        test( `loading hidden`, async ( { page } ) => {
            await expect( page.locator( Transport.loading ) ).not.toBeVisible()
        } )
        test( `play hidden`, async ( { page } ) => {
            await expect( page.locator( Transport.play ) ).not.toBeVisible()
        } )
        test( `pause enabled`, async ( { page } ) => {
            await expect( page.locator( Transport.pause ) ).toBeEnabled()
        } )
        test( `next enabled`, async ( { page } ) => {
            await expect( page.locator( Transport.next ) ).toBeDisabled()
        } )
    } )
} )