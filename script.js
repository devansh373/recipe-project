const container = document.querySelector(".container");
const wrapper = document.querySelector(".wrapper");
const input = document.querySelector("input");
const filtersDiv = document.querySelector(".filters");
let skip = 0;
let recipes = [];
function initiate() {
  skip = 0;
  if (input.value) {
    updateUiSearch();
    attachEventListeners();
    return;
  }
  fetch(`https://dummyjson.com/recipes?limit=10&skip=${skip}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network error");
      }
      return res.json();
    })
    .then((res) => {
      container.innerHTML = ``;
      console.log(res.recipes);
      recipes = recipes.concat(res.recipes);
      console.log(recipes);
      //   particularRecipe(recipes[0]);
      updateUi(res.recipes);
      attachEventListeners();
      //   loadMore.innerHTML = "Load More";
      loadMore.style.display = "block";
    })
    .catch((err) => {
      wrapper.innerHTML = err;
    });
}
initiate();
function updateUi(recipes) {
  filtersDiv.innerHTML = `<span class="filter"></span><span class="filter"></span
        ><span class="filter"></span>`;
  container.innerHTML += `${recipes
    .map(
      (r) => `
    <div class="recipe">
    <img src=${r.image}>
    <p>${r.name}</p>
    </div>
    `
    )
    .join("")}`;
}

const loadMore = document.querySelector(".load-more");

loadMore.addEventListener("click", () => {
  skip += 10;
  fetch(`https://dummyjson.com/recipes?limit=10&skip=${skip}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.recipes);
      recipes = recipes.concat(res.recipes);
      console.log(recipes);
      updateUi(res.recipes);
      attachEventListeners();
    })
    .catch((err) => {
      wrapper.innerHTML = err;
    });
});

// particular recipe page
function attachEventListeners() {
  const recipeElements = document.querySelectorAll(".recipe");
  // console.log(recipeElements)
  recipeElements.forEach((r) => {
    // console.log(r);
    r.addEventListener("click", () => {
      particularRecipe(
        recipes.find((rp) => rp.name === r.querySelector("p").innerText)
      );
    });
  });
}

function particularRecipe(recipeClicked) {
  // <span>${nameArray[0]}</span><span class="blvlt">${nameArray[1]}</span><span>${nameArray[2]}</span>
  console.log(recipeClicked);
  const nameArray = recipeClicked.name.split(" ");
  console.log(nameArray);
  //   wrapper.innerHTML = `
  container.innerHTML = `
  <div class="particular-recipe">
  <div class="top">
  <img src=${recipeClicked.image}>
  <h1 class="name">
  ${nameArray
    .map((n, i) => {
      if (i === 0) return `<span class="blvlt">${nameArray[i]}</span>`;
      else return `<span>${nameArray[i]}</span>`;
    })
    .join("")}
  
  </h1>
  <div class="close">X</div>
  </div>
  <div class="outer-1">
  <div class="ingredients">
  <h1><span class="blvlt">In</span>gredients</h1>
  <ol>
  ${recipeClicked.ingredients.map((i) => `<li>${i}</li>`).join("")}
  </ol>
  </div>
  <div class="right">
  <h1>Details</h1>
  <p>
  <span class="bold">
  Cuisine:
  </span>
  <span>
  ${recipeClicked.cuisine}
  </span>
  </p>
  <p>
  <span class="bold">
  Servings:
  </span>
  <span>
  ${recipeClicked.servings}
  </span>
  </p>
  <p>
  <span class="bold">
  Calories per serving:
  </span>
  <span>
  ${recipeClicked.caloriesPerServing}
  </span>
  </p>
  </div>
  </div>
  <div class="outer-2">
  <div class="instructions">
  <h1><span class="blvlt">In</span>structions</h1>
  <ol>
  ${recipeClicked.instructions.map((i) => `<li>${i}</li>`).join("")}
  </ol>
  </div>
  </div>
  
  </div>
  `;
  loadMore.style.display = "none";
  document.querySelector(".close").addEventListener("click", initiate);
}

// search feature

function updateUiSearch() {
  const recipesFound = recipes.filter((r) =>
    r.name.toLowerCase().includes(input.value.toLowerCase())
  );
  console.log(recipesFound);
  container.innerHTML = `${recipesFound
    .map(
      (r) => `
        <div class="recipe">
        <img src=${r.image}>
        <p>${r.name}</p>
        </div>
        `
    )
    .join("")}`;
}
input.addEventListener("input", (e) => {
  console.log(input.value);
  if (input.value) {
    updateUiSearch();
    attachEventListeners();
  } else {
    initiate();
  }
  // console.log(recipes[0].id)
  // console.log(recipes.filter(r=>r.id!=input.value))
});
// input.onc
