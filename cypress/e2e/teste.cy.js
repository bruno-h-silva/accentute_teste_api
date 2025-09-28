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

    it('Listar os livros disponíveis e imprimir nomes', () => {
        cy.request(`${baseUrl}BookStore/v1/Books`).then((response) => {
            cy.validarStatusCode(response, 200);
            const livros = response.body.books;
            expect(livros).to.be.an('array').and.to.have.length.greaterThan(0);
            livros.forEach((livro, index) => {
                cy.log(`${index + 1} - ${livro.title}`);
            });
        });
    });

    it('Alugar dois livros de livre escolha', () => {
        cy.request(`${baseUrl}BookStore/v1/Books`).then((response) => {
            cy.validarStatusCode(response, 200);
            const livros = response.body.books.slice(0, 2);
            const isbnList = livros.map(l => l.isbn);
            cy.log(`Livros selecionados: ${livros.map(l => l.title).join(', ')}`);
            cy.reserveBooks(baseUrl, token, userID, isbnList).then((res) => {
            cy.validarStatusCode(res, 201); // POST retorna 201 Created
            cy.log('Livros alugados com sucesso!');
            });
        });
    });

    it('Listar os detalhes do usuário com os livros alugados', () => {
        cy.getUserDetails(baseUrl, token, userID).then((response) => {
            cy.validarStatusCode(response, 200);
            const livrosAlugados = response.body.books;
            expect(livrosAlugados).to.be.an('array').and.to.have.length.greaterThan(0);
            livrosAlugados.forEach((livro, index) => {
                cy.log(`${index + 1} - ${livro.title}`);
            });
        });
    });
});