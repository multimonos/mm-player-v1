import { expect, test } from "@playwright/test"
import { History, NowPlaying, Queue, Player, Toasts, Transport } from "../selectors.js"
import { baseuri } from "../config.js"


test.describe( `Default state`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( baseuri )
    } )

    test.describe( `Player`, () => {
        test( `state is "idle"`, async ( { page } ) => {
            await expect(page.locator( Player.state )).toHaveValue( 'idle' )
        } )
    } )

} )