describe("Workouts", () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.login();
    cy.url().should("include", "/");
    cy.wait(2000);
  });

  beforeEach(() => {
    cy.visit("/workouts");
    cy.url().should("include", "/workouts");
  });

  it("should allow a user to add a new workout", () => {
    cy.get("button[aria-haspopup=dialog]").click();
    cy.wait(1000);
    cy.get("input[name=title]").type("Morning Run");
    cy.get("input[name=duration]").clear().type("30");
    cy.contains("button", "Create Workout").click();
    cy.wait(1000)
    cy.contains("Morning Run").should("exist");
  });

  it("should allow a user to edit a workout", () => {
    cy.get("img[alt=edit]").first().click();
    cy.get("input[name=duration]").clear().type("45");
    cy.contains("button", "Update Workout").click();
    cy.wait(1000);
    cy.contains("45 minutes").should("exist");
  });

  it("should allow a user to delete a workout", () => {
    cy.get("img[alt=delete]").first().click();
    cy.contains("Morning Run").should("not.exist");
  });
});
