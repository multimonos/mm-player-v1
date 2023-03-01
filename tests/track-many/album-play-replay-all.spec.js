import { expect, test } from "@playwright/test"
import { AlbumPage, Audio, History, NowPlaying, Player, Queue, Transport } from "../selectors.js"
import { audioAlbumUrl, delay } from "../config.js"


test.describe( `album play then replay all @playback @audiobug`, () => {

    test( `play -> completed -> previous* -> completed`, async ( { page } ) => {

        test.slow() // !! crucial !! \\

        await page.goto( audioAlbumUrl )
        await page.locator( AlbumPage.playAlbumButton ).click()

        // page
        await expect( page ).toHaveURL( '/player' )

        // is playing ?
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )

        // track 1
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 4 ) ) ).toHaveCount( 1 )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[1]' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '4' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )
        // track 2
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 3 ) ) ).toHaveCount( 1 )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[2]' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '3' )
        await expect( page.locator( History.count ) ).toHaveValue( '1' )
        // track 3
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 2 ) ) ).toHaveCount( 1 )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[3]' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '2' )
        await expect( page.locator( History.count ) ).toHaveValue( '2' )
        // track 4
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 1 ) ) ).toHaveCount( 1 )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[4]' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '3' )

        // is complete ?
        await page.locator( Queue.dataCount( 0 ) )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )
        await expect( page.locator( Player.state ) ).toHaveValue( 'paused' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '0' )
        await expect( page.locator( History.count ) ).toHaveValue( '4' )

        // await page.pause()

        // can click previous ?
        const previous = page.locator( Transport.previous )
        await expect( previous ).toBeEnabled()

        // random
        await delay( 250 )

        // do previous
        // one
        await previous.click()
        await previous.click()
        await previous.click()
        await previous.click()

        // assert at begginning of queue again
        // await expect( page.locator( NowPlaying.name ) ).toContainText( '[1]' )
        // await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        // await expect( page.locator( Queue.count ) ).toHaveValue( '4' )
        // await expect( page.locator( History.count ) ).toHaveValue( '0' )

        // is playing ?
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )

        // await page.pause()

        //
        // playing again
        //

        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )

        // track 1 - replay
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 4 ) ) ).toHaveCount( 1 )
        await expect( page.locator( Queue.count ) ).toHaveValue( '4' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[1]' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )

        // track 2 - replay
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 3 ) ) ).toHaveCount( 1 )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[2]' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '3' )
        await expect( page.locator( History.count ) ).toHaveValue( '1' )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[2]' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )

        // track 3 - replay
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 2 ) ) ).toHaveCount( 1 )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[3]' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '2' )
        await expect( page.locator( History.count ) ).toHaveValue( '2' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )

        // track 4 - replay
        await expect( page.locator( Player.dataState( 'playing' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 1 ) ) ).toHaveCount( 1 )
        await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '3' )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[4]' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )

        // is complete ?
        await expect( page.locator( Player.dataState( 'paused' ) ) ).toHaveCount( 1 )
        // await expect( page.locator( Queue.dataCount( 0 ) ) ).toHaveCount( 1 )
        await expect( page.locator( Queue.count ) ).toHaveValue( '0' )
        await expect( page.locator( History.count ) ).toHaveValue( '4' )
        await expect( page.locator( NowPlaying.name ) ).toContainText( '[4]' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )
    } )
} )
