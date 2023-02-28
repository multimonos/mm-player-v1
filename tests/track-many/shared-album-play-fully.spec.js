import { expect, test } from "@playwright/test"
import { Audio, History, NowPlaying, Player, Queue, SharePage } from "../selectors.js"
import { sharedAlbumUrl } from "../config.js"


test.describe( `shared album playback @playback`, () => {

    test( `play -> completed`, async ( { page } ) => {

        await page.goto( sharedAlbumUrl )
        await page.locator( SharePage.playButton ).click()

        // page
        await expect( page ).toHaveURL( '/player' )

        // is playing ?
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '4' )
        // const q = page.locator( Queue.count ).inputValue()
        // await expect( q ).toBeGreaterThan( 0 )


        // is complete ?
        await expect( page.locator( Queue.count ) ).toHaveValue( '0', { timeout: 60000 } )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )
        await expect( page.locator( Player.state ) ).toHaveValue( 'paused' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '4' )
        // await page.pause()
    } )
} )
