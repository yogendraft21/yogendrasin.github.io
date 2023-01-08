import data from "../../submissionData.json"; // do not create this file
// const data = [{ submission_link: "https://dev-hardik.netlify.app/", id: 0 }];

describe("Test", function () {
  let acc_score = 0;
  data.map(({ submission_link: url, id }) => {
    if (url && url.length) {
      this.beforeAll(() => {
        cy.task("createFolder", "cypress/downloads").then(() => {
          cy.log("Downloads folder created and ready for testing");
        });
      });
      beforeEach(() => {
        cy.visit(url);
      });

      it(`Submitted link should be a github.io link`, () => {
        cy.url().should("include", ".github.io/");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check for basic components`, () => {
        cy.get('[id="nav-menu"]');
        cy.get('[id="about"]');
        cy.get('[id="skills"]');
        cy.get('[id="projects"]');
        cy.get('[id="contact"]');
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check if navbar contains required components`, () => {
        cy.get(".nav-link.home");
        cy.get(".nav-link.about");
        cy.get(".nav-link.skills");
        cy.get(".nav-link.projects");
        cy.get(".nav-link.contact");
        cy.get(".nav-link.resume");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check if navbar components are linked to respective elements`, () => {
        cy.isInViewport("#nav-menu");
        cy.get(".nav-link.about").click();
        cy.isScrolledTo("#about");
        cy.then(() => {
          acc_score += 1;
        });

        cy.visit(url);
        cy.isInViewport("#nav-menu");
        cy.get(".nav-link.skills").click();
        cy.isScrolledTo("#skills");
        cy.then(() => {
          acc_score += 1;
        });

        cy.visit(url);
        cy.isInViewport("#nav-menu");
        cy.get(".nav-link.projects").click();
        cy.isScrolledTo("#projects");
        cy.then(() => {
          acc_score += 1;
        });

        cy.visit(url);
        cy.isInViewport("#nav-menu");
        cy.get(".nav-link.contact").click();
        cy.isScrolledTo("#contact");
        cy.then(() => {
          acc_score += 1;
        });

        cy.isInViewport("#nav-menu");
        cy.get(".nav-link.home").click();
        cy.isScrolledTo("#home");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check if name is included`, () => {
        cy.get('[id="user-detail-name"]').invoke("text").should("not.be.empty");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check for introduction`, () => {
        cy.get('[id="user-detail-intro"]')
          .invoke("text")
          .should("not.be.empty");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check for title in About Section`, () => {
        cy.get("#about.about.section").contains("About");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check for professional photo`, () => {
        cy.get(".home-img").find("img").should("have.attr", "src");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check for components in Projects Section`, () => {
        cy.get(".project-card").each(($proj) => {
          cy.wrap($proj).find("img").should("have.attr", "src");
          cy.wrap($proj)
            .find(".project-title")
            .invoke("text")
            .should("not.be.empty");
          cy.wrap($proj)
            .find(".project-description")
            .invoke("text")
            .should("not.be.empty");

          cy.wrap($proj).find(".project-tech-stack").should("not.be.empty");

          cy.wrap($proj)
            .get(".project-github-link")
            .should("have.attr", "href")
            .and("include", "https://github.com/");
          cy.wrap($proj)
            .get(".project-github-link")
            .invoke("attr", "target")
            .should("eq", "_blank");
          cy.wrap($proj)
            .get(".project-github-link")
            .then((link) => {
              cy.request(link.prop("href")).its("status").should("eq", 200);
            });

          cy.wrap($proj)
            .get(".project-deployed-link")
            .should("have.attr", "href");
          cy.wrap($proj)
            .get(".project-deployed-link")
            .invoke("attr", "target")
            .should("eq", "_blank");
          cy.wrap($proj)
            .get(".project-deployed-link")
            .then((link) => {
              cy.request(link.prop("href")).its("status").should("eq", 200);
            });

          cy.then(() => {
            acc_score += 1;
          });
        });
      });

      it(`Check for links to GitHub and LinkedIn`, () => {
        cy.get('[id="contact-github"]')
          .should("have.attr", "href")
          .and("include", "https://github.com/");
        cy.get('[id="contact-github"]')
          .invoke("attr", "target")
          .should("eq", "_blank");
        cy.then(() => {
          acc_score += 1;
        });

        cy.get('[id="contact-linkedin"]')
          .should("have.attr", "href")
          .and("include", "https://www.linkedin.com/in/");
        cy.get('[id="contact-linkedin"]')
          .invoke("attr", "target")
          .should("eq", "_blank");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check if phone number is present`, () => {
        cy.get('[id="contact-phone"]').invoke("text").should("not.be.empty");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check if email address is present`, () => {
        cy.get('[id="contact-email"]').invoke("text").should("not.be.empty");
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`Check if resume button in Resume section is downloading a PDF file`, () => {
        cy.task("deleteFilesIn", "cypress/downloads").then(() => {
          cy.get('[id="resume-button-1"]').click();
          cy.wait(3000).then(() => {
            cy.task("getFilesIn", "cypress/downloads").then((after) => {
              expect(
                after.length,
                "Could not download resume. Please check if the download button is working as expected."
              ).to.be.eq(1);

              const fileName = after[0];
              expect(
                fileName.split(".").pop(),
                "Downloaded file is not in PDF format"
              ).to.be.eq("pdf");
              cy.then(() => {
                acc_score += 1;
              });
            });
          });
        });
      });

      it(`Check if resume button in Home/About section is downloading a PDF file`, () => {
        cy.task("deleteFilesIn", "cypress/downloads").then(() => {
          cy.get('[id="resume-button-2"]').click();
          cy.wait(3000).then(() => {
            cy.task("getFilesIn", "cypress/downloads").then((after) => {
              expect(
                after.length,
                "Could not download resume. Please check if the download button is working as expected."
              ).to.be.eq(1);

              const fileName = after[0];
              expect(
                fileName.split(".").pop(),
                "Downloaded file is not in PDF format"
              ).to.be.eq("pdf");
              cy.then(() => {
                acc_score += 1;
              });
            });
          });
        });
      });

      it(`Check if the resume links are google drive links and open in a new tab`, () => {
        cy.get('[id="resume-link-1"]')
          .should("have.attr", "href")
          .and("include", "https://drive.google.com/");
        cy.get('[id="resume-link-1"]')
          .invoke("attr", "target")
          .should("eq", "_blank");

        cy.get('[id="resume-link-2"]')
          .should("have.attr", "href")
          .and("include", "https://drive.google.com/");
        cy.get('[id="resume-link-2"]')
          .invoke("attr", "target")
          .should("eq", "_blank");

        cy.then(() => {
          acc_score += 2;
        });
      });

      it(`Check if the resume buttons are within the respective sections`, () => {
        cy.get('[id="nav-menu"]').within(() => {
          cy.get('[id="resume-button-1"]');
        });
        cy.then(() => {
          acc_score += 1;
        });

        cy.get('[id="home"],[id="about"]').within(() => {
          cy.get('[id="resume-button-2"]');
        });
        cy.then(() => {
          acc_score += 1;
        });
      });
    }

    it(`generate score`, () => {
      //////////////
      console.log(acc_score);
      let result = {
        id,
        marks: Math.floor(acc_score),
      };
      result = JSON.stringify(result);
      cy.writeFile("results.json", `\n${result},`, { flag: "a+" }, (err) => {
        if (err) {
          console.error(err);
        }
      });
      //////////////////
    });
  });
});
