// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add( "tid", (name,options={}) => {
    return cy.get( `[data-tid="${name}"]`, options)
} )

Cypress.Commands.add( "stateIs", name => {
    cy.get( `[data-playerstate="${name}"]`, { timeout: 10000 } ).should(`be.visible`)
} )

Cypress.Commands.add( "stateBecomes", stateSequence => {
    stateSequence.map( name => {
        cy.get( `[data-playerstate="${name}"]`, { timeout: 10000 } ).should( `be.visible` )
    } )
} )
