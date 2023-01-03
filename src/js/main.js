const url = "https://api.tvmaze.com/shows/82/episodes";
const container = document.getElementById("content__container");
const search = document.getElementById("search");
const select = document.getElementById("select");
const numberOfFound = document.getElementById("amount");
let amount = document.createElement("p");
let selected = false;

console.clear();
function addCards(data, selected) {
  let cards = "";

  selected ? addHtml(data) : data.forEach((movie) => addHtml(movie));

  function addHtml(movie) {
    let description = movie.summary
      .replaceAll("<p>", "")
      .replaceAll("</p>", "");
    cards += `
            <article class="col-md-4 col-sm-6 col-xl-3 p-3">
                <div class="card">
            <img class="card-img-top" src="${movie.image.medium}">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div class="nameAndEpisode d-flex align-items-center justify-content-between mb-2 gap-2">
                        <h5 class="card-title">${movie.name}</h5>
                        <p class="bg-danger text-white p-1 rounded">${episodeFactory(
                          movie.season,
                          movie.number
                        )}</p>
                    </div>
                    <div class="card__description">
                        <p class="card-text">${description}</p>    
                    </div>       
                <a href="${
                  movie.url
                }" class="btn btn-danger text-white">See More In TVMaze.com</a>
                </div>
                </div>
            </article>
            `;
  }
  container.innerHTML = cards;
}

function episodeFactory(season, episode) {
  return `S${season > 9 ? season : "0" + season}E${
    episode > 9 ? episode : "0" + episode
  }`;
}

function addOption(data) {
  data.map((el) => {
    let epi = episodeFactory(el.season, el.number);
    select.innerHTML += `<option value="${epi}">${epi} - ${el.name}</option>`;
  });
}

function howMany(found, input) {
  if (input !== "") {
    numberOfFound.innerHTML =
      found > 0
        ? `<p class="w-25 p-2 mt-3 rounded mx-auto bg-danger text-white">${found} match found</p>`
        : "";
  }
}

const getData = async (link) => {
  try {
    const response = await fetch(link);
    const data = await response.json();

    search.value === "" && addCards(data);
    addOption(data);

    select.addEventListener("change", (e) => {
      let temp = e.target.value;
      temp === "All" && addCards(data);
      data.filter((el) => {
        selected = true;
        let epi = episodeFactory(el.season, el.number);
        epi === temp && addCards(el, selected);
      });
    });

    search.addEventListener("input", (e) => {
      let searched = e.target.value;
      let result = [];
      data.map((el) => {
        (el.name.toLowerCase().includes(searched) ||
          el.summary.toLowerCase().includes(searched)) &&
          result.push(el);
      });
      howMany(result.length, searched);
      addCards(result);
    });
  } catch {}
};

getData(url);
