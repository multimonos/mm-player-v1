import { expect, test } from "@playwright/test"
import { History, Queue, States, Toasts, Transport, NowPlaying } from "./selectors.js"


test.describe( `Default State`, () => {

    test.beforeEach( async ( { page } ) => {
        await page.goto( "/testing/state" )
    } )

    test.describe( `Player`, () => {
        test( `state is "idle"`, async ( { page } ) => {
            await page.locator( States.player( 'idle' ) )
        } )
    } )

    test.describe( `Queue`, () => {
        test( `state is "idle"`, async ( { page } ) => {
            await page.locator( Queue.state( 'idle' ) )
        } )
        test( `exists`, async ( { page } ) => {
            await expect( page.locator( Queue.root ) ).toBeVisible()
        } )
        test( `is empty`, async ( { page } ) => {
            await expect( page.locator( Queue.empty ) ).toBeVisible()
        } )
    } )

    test.describe( `Now Playing`, () => {
        test( `exists`, async ( { page } ) => {
            await expect( page.locator( NowPlaying.root ) ).toBeVisible()
        } )
        test( `is empty`, async ( { page } ) => {
            await expect( page.locator( NowPlaying.empty ) ).toBeVisible()
        } )
    } )

    test.describe( `History`, () => {
        test( `exists`, async ( { page } ) => {
            await expect( page.locator( History.root ) ).toBeVisible()
        } )
        test( `is empty`, async ( { page } ) => {
            await expect( page.locator( History.empty ) ).toBeVisible()
        } )
    } )

    test.describe(`Toasts`, ()=>{
        test(`state is "idle"`, async( { page } ) => {
            await expect(page.locator(Toasts.state('idle'))).toBeVisible()
        })
    })

    test.describe( `Transport`, () => {
        test( `play is disabled`, async ( { page } ) => {
            const play = await page.locator( Transport.play )
            await expect( play ).toBeVisible()
            await expect( play ).toBeDisabled()
        } )
        test( `next is disabled`, async ( { page } ) => {
            const next = await page.locator( Transport.next )
            await expect( next ).toBeVisible()
            await expect( next ).toBeDisabled()
        } )
        test( `previous is disabled`, async ( { page } ) => {
            const previous = await page.locator( Transport.previous )
            await expect( previous ).toBeDisabled()
            await expect( previous ).toBeDisabled()
        } )
        test( `pause not visible`, async ( { page } ) => {
            await expect( page.locator( Transport.pause ) ).not.toBeVisible()
        } )
        test( `loading not visible`, async ( { page } ) => {
            await expect( page.locator( Transport.loading ) ).not.toBeVisible()
        } )
    } )
} )