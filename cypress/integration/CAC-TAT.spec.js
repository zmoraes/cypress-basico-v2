/// <reference types="Cypress" />

describe("Central de atendimento ao cliente TAT", function () {
  beforeEach(() => cy.visit("./src/index.html"));

  it("Verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("Preenche os campos obrigatórios e envia o formulário", function () {
    const longText =
      "Muito bom o curso. Prático e objetivo... Muito bom o curso. Prático e objetivo... Muito bom o curso. Prático e objetivo...";
    cy.get("#firstName").type("Maria Joana");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("mjs@gmail.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get(".success > strong")
      .should("be.visible")
      .should("have.text", "Mensagem enviada com sucesso.");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", function () {
    const longText =
      "Muito bom o curso. Prático e objetivo... Muito bom o curso. Prático e objetivo... Muito bom o curso. Prático e objetivo...";
    cy.get("#firstName").type("Maria Joana");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("mjsg@mail,com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get(".error > strong")
      .should("be.visible")
      .should("have.text", "Valide os campos obrigatórios!");
  });

  it("campo telefone continua vazia quando preenchido com valor não-númerico", function () {
    cy.get("#phone").type("texto");
    cy.get(".button").click();
    cy.get("#phone").should("have.text", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function () {
    cy.get("#firstName").type("Maria Joana");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("mjs@gmail.com");
    cy.get("#phone-checkbox").check(); //telefone passa a ser obrigatório
    cy.get("#open-text-area").type("Teste");
    cy.get('button[type="submit"]').click();
    cy.get(".error > strong")
      .should("be.visible")
      .should("have.text", "Valide os campos obrigatórios!");
    cy.get("#phone").should("have.text", "");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", function () {
    cy.get("#firstName")
      .type("Maria Joana")
      .should("have.value", "Maria Joana")
      .clear()
      .should("have.text", "");

    cy.get("#lastName")
      .type("Silva")
      .should("have.value", "Silva")
      .clear()
      .should("have.text", "");

    cy.get("#email")
      .type("mjsgmailcom")
      .should("have.value", "mjsgmailcom")
      .clear()
      .should("have.text", "");

    cy.get("#phone")
      .type(11919137878)
      .should("have.value", 11919137878)
      .clear()
      .should("have.text", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", function () {
    cy.contains("button", "Enviar").click(); //usando o "contains" no lugar do "get"
    cy.get(".error > strong").should("be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado", function () {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success > strong").should(
      "have.text",
      "Mensagem enviada com sucesso."
    );
  });

  it("seleciona um produto (YouTube) por seu texto", function () {
    cy.get("#product").select("YouTube").should("have.value", "youtube"); //select por texto
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", function () {
    cy.get("#product").select("mentoria").should("have.value", "mentoria"); //select por value
  });

  it("seleciona um produto (Blog) por seu índice", function () {
    cy.get("#product").select(1).should("have.value", "blog"); //select por indice
  });

  it('marca o tipo de atendimento "Feedback"', function () {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("marca cada tipo de atendimento", function () {
    cy.get('input[type="radio"]')
      .check()
      .should("have.length", 3)
      .each(function ($radio) {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca o último", function () {
    cy.get('#check input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("be.not.checked");
  });

  it("seleciona um arquivo da pasta fixtures", function () {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json")
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", function () {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", function () {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile", { action: "drag-drop" })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", function () {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicanco no link", function () {
    cy.get("#privacy a").invoke("removeAttr", "target").click();
    cy.contains("Talking About Testing").should("be.visible");
  });
});
