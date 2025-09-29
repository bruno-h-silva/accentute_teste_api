import { fakerPT_BR as faker } from "@faker-js/faker";

const baseUrl = 'https://demoqa.com/';
let userID;
let userName;
let password = '@Bc123456';
let token;

describe('Testes de API', () => {
    it('Criar usuário', () => {
        cy.fixture("user").then((body) => {
            body.userName = faker.person.fullName();
            body.password = password;
            cy.post(baseUrl, 'Account/v1/User', body).then((response) => {
                cy.validarStatusCode(response, 201);
                cy.validarSchema("user.json", response.body);
                userID = response.body.userID;
                userName = body.userName;
                cy.log(`UserID: ${userID}`);
                cy.log(`UserName: ${userName}`);
            });
        });
    });

    it('Gerar um token de acesso', () => {
        cy.post(baseUrl, 'Account/v1/GenerateToken', {
            userName,
            password
        }).then((response) => {
            cy.validarStatusCode(response, 200);
            token = response.body.token;
            cy.log(`Token: ${token}`);
        });
    });

    it('Confirmar se o usuário criado está autorizado', () => {
        cy.post(baseUrl, 'Account/v1/Authorized', {
            userName,
            password
        }).then((response) => {
            cy.validarStatusCode(response, 200);
        });
    });

    it('Deletar usuário', () => {
        cy.delete(baseUrl, `Account/v1/User/${userID}`, null, { Authorization: `Bearer ${token}` })
        .then((response) => {
            cy.log(`Token usado: ${token}`);
            if (response.status === 200) {
                cy.log(`Usuário ${userName} deletado com sucesso!`);
            } else if (response.status === 204) {
                cy.log(`Usuário ${userName} não tem permissão para deletar (204 Unauthorized)`);
            } else {
                cy.log(`Erro inesperado ao deletar: ${JSON.stringify(response.body)}`);
            }
            
            expect([200, 204]).to.include(response.status);
        });
    });
});