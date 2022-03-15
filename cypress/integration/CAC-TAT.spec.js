/// <reference types="Cypress" />

describe("Central de atendimento ao cliente TAT", function () {
  const THREE_SECONDS_IN_MS = 3000;
  beforeEach(() => cy.visit("./src/index.html"));

  it("Verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("Preenche os campos obrigatórios e envia o formulário", function () {
    //lodash "Cypres._." existem várias funçoes que podem otimizar o teste - Seção 12 - 47
    const longText = Cypress._.repeat("Muito bom o curso. ", 20);
    //combinação clock + tick pode deixar a execução do teste mais rapido
    cy.clock(); //congela o tempo. Mensagem de sucesso fica estática
    cy.get("#firstName").type("Maria Joana");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("mjs@gmail.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get(".success > strong").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS); //espera 3 segundos e mensagem desaparece
    cy.get(".success > strong").should("be.not.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", function () {
    cy.clock();
    cy.get("#firstName").type("Maria Joana");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("mjsg@mail,com");
    cy.get("#open-text-area").type("Teste");
    cy.get('button[type="submit"]').click();
    cy.get(".error > strong")
      .should("be.visible")
      .should("have.text", "Valide os campos obrigatórios!");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error > strong").should("be.not.visible");
  });

  it("campo telefone continua vazia quando preenchido com valor não-númerico", function () {
    cy.get("#phone").type("texto");
    cy.get(".button").click();
    cy.get("#phone").should("have.text", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function () {
    cy.clock();
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
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error > strong").should("be.not.visible");
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
    cy.clock();
    cy.contains("button", "Enviar").click(); //usando o "contains" no lugar do "get"
    cy.get(".error > strong").should("be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado", function () {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success > strong").should(
      "have.text",
      "Mensagem enviada com sucesso."
    );
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success > strong").should("be.not.visible");
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

  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke()", function () {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("preencher a area de texto usando o comando invoke", function () {
    //o invoke deixa o teste mais rapido que o delay - um dos testes acima.
    const longText = Cypress._.repeat("Teste invoke value ", 20);
    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("faz uma requisição HTTP", function () {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      //console.log(response); //analisa o retorno antes de fazer as validações.
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  it("encontrando o gato", function () {
    cy.get("#cat").should("not.be.visible").invoke("show").should("be.visible");

    //mudando o título e subtítulo
    cy.get("#title").invoke("text", "CAT TAT");
    cy.get("#subtitle").invoke("text", "Eu 💖 gatos");
  });
});
