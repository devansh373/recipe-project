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
      recipes = [];
      recipes = recipes.concat(res.recipes);
      console.log(recipes);

      updateUi(res.recipes);
      attachEventListeners();

      loadMore.style.display = "block";
    })
    .catch((err) => {
      wrapper.innerHTML = err;
    });
}
initiate();
function updateUi(recipes) {
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
  loadMore.disabled = true;
  skip += 10;
  fetch(`https://dummyjson.com/recipes?limit=10&skip=${skip}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.recipes);
      recipes = recipes.concat(res.recipes);
      console.log(recipes);
      updateUi(res.recipes);
      attachEventListeners();
      loadMore.disabled = false;
    })
    .catch((err) => {
      wrapper.innerHTML = err;
    });
});

// particular recipe page
const filterElements = document.querySelectorAll(".filter");
function attachEventListeners() {
  const recipeElements = document.querySelectorAll(".recipe");

  recipeElements.forEach((r) => {
    r.addEventListener("click", () => {
      particularRecipe(
        recipes.find((rp) => rp.name === r.querySelector("p").innerText)
      );
    });
  });
  filterElements.forEach((f) => {
    f.addEventListener("click", (e) => {
      updateUiFilters(filterElements, e.target, e.target.innerText, false);
    });
  });
}
const clearFilterElement = document.querySelector(".clear-filter");
clearFilterElement.addEventListener("click", (e) => {
  updateUiFilters(filterElements, e.target, e.target.innerText, true);
});
function updateUiFilters(
  filterElements,
  activeFilterElement,
  filterName,
  isClear
) {
  if (activeFilterElement.classList.contains("active-filter") && !isClear)
    return;
  filterElements.forEach((f) => {
    f.classList.remove("active-filter");
  });

  if (isClear) {
    res = [];
    initiate();
    loadMore.style.display="block";
    return;
  }

  filterElements.forEach((f) => {
    f.classList.remove("active-filter");
  });
  activeFilterElement.classList.add("active-filter");

  // yet to confirm whether to fetch or find in only shown recipes
  // api allows only single filter at a time but multiple filters can be applied locally
  fetch(`https://dummyjson.com/recipes/meal-type/${filterName}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.recipes);
      container.innerHTML = `${res.recipes
        .map(
          (r) => `
            <div class="recipe">
            <img src=${r.image}>
            <p>${r.name}</p>
            </div>
            `
        )
        .join("")}`;
    });
    loadMore.style.display="none";
}

function particularRecipe(recipeClicked) {
  console.log(recipeClicked);
  const nameArray = recipeClicked.name.split(" ");
  console.log(nameArray);

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
  document.querySelector(".close").addEventListener("click", () => {
    recipes = [];
    initiate();
  });
}

// search feature

function updateUiSearch() {
  // local search
  //   const recipesFound = recipes.filter((r) =>
  //     r.name.toLowerCase().includes(input.value.toLowerCase())
  //   );
  //   console.log(recipesFound);
  //   container.innerHTML = `${recipesFound
  //     .map(
  //       (r) => `
  //         <div class="recipe">
  //         <img src=${r.image}>
  //         <p>${r.name}</p>
  //         </div>
  //         `
  //     )
  //     .join("")}`;

  // api search

  if (input.value.length > 0) {
    loadMore.style.display = "none";
  }
  console.log("first")
  fetch(`https://dummyjson.com/recipes/search?q=${input.value}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.recipes.length === 0) {
        container.innerHTML = "No results found";
        return;
      }
      // console.log();
      container.innerHTML = `${res.recipes
        .map(
          (r) => `
        <div class="recipe">
        <img src=${r.image}>
        <p>${r.name}</p>
        </div>
        `
        )
        .join("")}`;
    });
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
  };
}
const debouncedSearch = debounce(updateUiSearch,500);
input.addEventListener("input", (e) => {
  // console.log(input.value);
  if (input.value) {
    debouncedSearch()
    attachEventListeners();
  } else {
    res = [];
    initiate();
  }
});
