/*först kollar jag hur datat från API:n ser ut, använder await för att ...
await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a" )
  .then(res => res. json())
  .then(data => console.log(data));
*/
/* sedan hämtar jag och consoleloggar alla meals i datan
fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a")
  .then(res => res.json())
  .then(data => {
    if (!data.meals) { //om inget objekt (korrekt term?) som heter meals hittas i datan, skriv ut nedanstående
      console.log("Inga rätter hittades.");
      return;
    } else {
    console.log(data.meals);
    }
  })
  .catch(err => console.error("Fel vid hämtning:", err));
*/

/*eftersom API:n enbart ger måltider som börjar på bokstaven "a"
kan jag plocka fram måltiderna på nedanstående vis */

/*
fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a")
  .then(res => res.json())
  .then(data => {
    if (!data.meals) { //om inget objekt (korrekt term?) som heter meals hittas i datan, skriv ut nedanstående
      console.log("Inga rätter hittades.");
      return;
    } else {
      data.meals.forEach(meal => console.log(meal.strMeal));
    }
  })
  .catch(err => console.error("Fel vid hämtning:", err));
*/
/*men eftersom det bara är totalt fem måltider vill jag utöka sökningen
så att måltider på alla bokstäver hämtas och för det behöver jag plocka in resultat
från lika många url:er som alfabetet, därför skapar jag en funktion*/

const allMeals = []; //skapar en variabel/en tom lista som ska fyllas på med alla rätter oavsett första bokstav
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

async function fetchAllaRatter() {
  for (const letter of letters) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await res.json();
    if (data.meals) {
      allMeals.push(...data.meals);
    }
  }
  allMeals.forEach(meal => console.log(meal.strMeal));
}

fetchAllaRatter();
