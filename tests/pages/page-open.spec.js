import { expect, test } from "@playwright/test"
import { Audio, History, NowPlaying, Player, Queue, SharePage } from "../selectors.js"
import { sharedAlbumUrl } from "../config.js"


const timeout = 60000

test.describe( `/open`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( sharedAlbumUrl )
    } )

    test( `audio context is undefined`, async ( { page } ) => {
        await expect( page.locator( Audio.state ) ).toHaveValue( 'undefined' )
    } )

    test( `queue is empty`, async ( { page } ) => {
        await expect( page.locator( Queue.count ) ).toHaveValue( '0' )
    } )

    test( `history empty`, async ( { page } ) => {
        await expect( page.locator( History.count ) ).toHaveValue( '0' )
    } )

    test.describe( 'after click play', () => {

        test.beforeEach( async ( { page } ) => {
            await page.locator( SharePage.playButton ).click()
        } )

        test( `navigates to /player`, async ( { page } ) => {
            await expect( page ).toHaveURL( '/player' )
        } )

        test( `queue has length 4`, async ( { page } ) => {
            await expect( page.locator( Queue.count ) ).toHaveValue( '4' )
        } )

        test( `history is empty`, async ( { page } ) => {
            await expect( page.locator( History.count ) ).toHaveValue( '0' )
        } )

        test( `audio context is running`, async ( { page } ) => {
            await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        } )

        test( `now playing has length 1`, async ( { page } ) => {
            await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        } )

        test( `4 tracks played @playback`, async ( { page } ) => {
            await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
            await expect( page.locator( Queue.count ) ).toHaveValue( '0', { timeout: 60000 } )
            await expect( page.locator( History.count ) ).toHaveValue( '4' )
        } )

    } )
} )
