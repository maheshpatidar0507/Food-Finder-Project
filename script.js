const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealEl = document.getElementById("meals");
const resultHeading = document.getElementsByClassName("result-heading");
const single_mealEl = document.getElementById("single-meal");

// search meales
function searchmeal(e) {
  e.preventDefault();

  //clear single meal
  single_mealEl.innerHTML = "";

  // get search meal
  const term = search.value;

  // ckeck for empty
  if (term.trim()) {
    fetch(`www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `h2>Search Result for ${term}`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<h2>There are no Result for ${term}`;
        } else {
          mealEl.innerHTML = data.meals
            .map(
              (meal) => `
                    <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"></img>
                    <div class ="meal-info" data mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                    </div>
                  </div>
                  `
            )
            .join("");
        }
      });
  } else {
    alert("Please insert a value in Search");
  }
}

//
// fetch meal by Id
function getMealById(mealID) {
  fetch(`www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

//Random meal
function randomMeal() {
  mealEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// add meal to dom
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 0; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`
                ${meal[`strIngredients${i}`]} - ${meal[`strMeasure${i}`]}
                `);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
<div class="single-meal">
<h1>${meal.strMeal}</h1>
<img src="${meal.strMealThumb}" alt=${meal.strMeal}"/>
<div class="single-meal-info">
${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
</div>
<div class="main">
<p>${meal.strInstructions}</p>
<h2>Ingedient</h2>
<ul>
${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
</ul>
</div>
</div>
`;
}
// event listener

submit.addEventListener("submit", searchmeal);
random.addEventListener("click", randomMeal);
mealEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealInfo);
  }
});
