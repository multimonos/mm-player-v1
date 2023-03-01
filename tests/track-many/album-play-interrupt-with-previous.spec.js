import { expect, test } from "@playwright/test"
import { AlbumPage, Audio, History, NowPlaying, Player, Queue, Transport } from "../selectors.js"
import { audioAlbumUrl, delay } from "../config.js"


test.describe( `album play then interrupt with previous @playback @audiobug`, () => {

    test( `play -> wait -> previous -> completed`, async ( { page } ) => {

        test.slow() // !! crucial !! \\

        await page.goto( audioAlbumUrl )
        await page.locator( AlbumPage.playAlbumButton ).click()

        // page
        await expect( page ).toHaveURL( '/player' )

        // track 1
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )

        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[1]' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '4' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )

        // track 2
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )

        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[2]' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '3' )
        await expect( page.locator( History.count ) ).toHaveValue( '1' )

        await delay( 1250 )

        await expect( page.locator( Transport.previous ) ).toBeEnabled()
        await page.locator( Transport.previous ).click()

        // track one - again
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )

        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[1]' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '4' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )

        // dummy wait so i can watch
        await expect( page.locator( '[data-foobar]' ), { timeout: 30000 } ).toHaveCount( 1 )
        // await page.pause() // expect that only 1 audio is playing
    } )
} )
