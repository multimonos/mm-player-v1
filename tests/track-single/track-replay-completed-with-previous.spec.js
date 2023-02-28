import { expect, test } from "@playwright/test"
import { AlbumPage, Audio, History, Queue, Player, Transport } from "../selectors.js"
import { audioAlbumUrl } from "../config.js"


test.describe( `single track replay completed with previous @playback`, () => {

    test( `play -> completed -> previous`, async ( { page } ) => {
        await page.goto( audioAlbumUrl )
        await page.locator( AlbumPage.playTrackButton ).first().click()

        // first play
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( Player.state ), { timeout: 60000 } ).toHaveValue( 'paused' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )

        // finished playing
        await expect( page.locator( Queue.count ) ).toHaveValue( '0' )
        await expect( page.locator( History.count ) ).toHaveValue( '1' )

        // second playing
        await expect( page.locator( Transport.previous ) ).toBeEnabled()
        await page.locator( Transport.previous ).click()
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( Player.state ), { timeout: 60000 } ).toHaveValue( 'paused' )

        // finished playing
        await expect( page.locator( Queue.count ) ).toHaveValue( '0' )
        await expect( page.locator( History.count ) ).toHaveValue( '1' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )
        // await page.pause()
    } )

} )
