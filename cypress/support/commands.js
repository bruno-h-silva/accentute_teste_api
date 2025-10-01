const {expect} = require("chai").use(require('chai-json-schema'))

Cypress.Commands.add('validarSchema', (schemaPath, responseBody) => {
    cy.readFile(`cypress/schemas/${schemaPath}`).then((schema) => {
        expect(responseBody).to.be.jsonSchema(schema)
        cy.log('Schema validado com sucesso!')
    })
});

Cypress.Commands.add('validarStatusCode', (response, statusCode) => {
    expect(response.status).to.equal(statusCode)
    cy.log('Status Code validado com sucesso: ' + statusCode)
});


Cypress.Commands.add('post', (url, endpoint, body, authToken) => {
    const requestUrl = url + endpoint;
    const options = {
        method: 'POST',
        url: requestUrl,
        body: body,
        failOnStatusCode: false
    };
    if (authToken) {
        options.headers = { Authorization: `Bearer ${authToken}` };
    }
    return cy.request(options);
});

Cypress.Commands.add('reserveBooks', (baseUrl, authToken, userId, isbnList) => {
    const payload = {
        userId,
        collectionOfIsbns: isbnList.map(isbn => ({ isbn }))
    };
    return cy.request({
        method: 'POST', 
        url: `${baseUrl}BookStore/v1/Books`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: payload,
        failOnStatusCode: false
    });
});

Cypress.Commands.add('getUserDetails', (baseUrl, token, userId) => {
    return cy.request({
        method: 'GET',
        url: `${baseUrl}Account/v1/User/${userId}`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        failOnStatusCode: false 
    });
});