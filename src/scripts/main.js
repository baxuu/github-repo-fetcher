/**
 *  App to display information from github api about user's repository updated after the given date. You can add more than one repos tag.
 * @author Artur Królczyk <krolczyk.artur@gmail.com>
 */

const API = "https://api.github.com/users/";

/**
 * Render column header of the table
 * @function renderColumns
 * @return {string}
 */

const renderColumns = () => {
  const columns = [
    "Repository name",
    "Repository description",
    "Last changes",
    "Download link",
  ];
  return `
  ${columns.map((column) => `<th>${column}</th> `).join("")}`;
};

/**
 * Render all repositories fetched from github api updated after the given date to the html model
 * @function renderAllRepositories
 * @param {object} repositories list of all users repositories
 * @return {void}
 */

const renderAllRepositories = (repositories) => {
  const app = document.querySelector(".app");

  repositories.forEach(({ usersRepositories, minimumDate }) => {
    const repositoriesOwner = usersRepositories[0].owner.login;

    const html =
      `<h1><i class="fab fa-github"></i> ${repositoriesOwner}</h1>
      ${renderColumns()}` +
      usersRepositories
        .map(({ updated_at, name, description, html_url }) => {
          if (updated_at >= minimumDate) {
            return `
         <tr>
         <td>${name}</td>
         <td>${description || "Description not found"} </td>
         <td>${new Date(updated_at).toLocaleString()}</td>
         <td><a class ="repo__download" href="${html_url}/archive/master.zip"><i class="fas fa-download"> </i> </a></td>
         </tr>
          `;
          }
        })
        .join("");

    app.insertAdjacentHTML("afterbegin", html);
  });
};

/**
 * Fetch user repositories from github api
 * @function fetchRepo
 * @param {string} user provided in attribute name
 * @return {Object}
 */

const fetchRepo = async (user) => {
  try {
    const response = await fetch(`${API}${user}/repos?sort=updated`);
    return await response.json();
  } catch (e) {
    alert(`User ${user} does not not exist!`);
  }
};

/**
 * Get all repositories (when there is more than 1 repos tag) from github
 * @function getAllRepositories
 * Single repositories are fetched using {@link fetchRepo} function.
 * @return {Array}
 */

const getAllRepositories = async () => {
  const reposTags = document.getElementsByTagName("repos");
  const reposData = [];
  const reposArray = Array.from(reposTags);

  for (const repo of reposArray) {
    const user = repo.attributes["data-user"].textContent;
    const minimumDate = repo.attributes["data-update"].textContent;
    const usersRepositories = await fetchRepo(user);
    reposData.push({ usersRepositories, minimumDate });
  }

  return reposData;
};

/**
 * Initial function
 * @function main
 * @return {void}
 */

const main = async () => {
  const allRepositories = await getAllRepositories();
  renderAllRepositories(allRepositories);
};

main();
