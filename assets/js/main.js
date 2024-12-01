document.querySelectorAll('#pick_api input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
        document.querySelectorAll('#pick_api input[type="checkbox"]').forEach((box) => {
            if (box !== event.target) box.checked = false;
        });
    });
});

const API_KEY = "52+h4tqbK4TMmVtPojeolg==ZllXe3aqjDuN6YgX";
const BASE_URLS = {
    cats: "https://api.api-ninjas.com/v1/cats",
    dogs: "https://api.api-ninjas.com/v1/dogs",
};

function formatApiResponse(data, selectedAPI) {
    if (selectedAPI === "cats") {
        const cat = data[0];
        return `
            Name: ${cat.name}
            Origin: ${cat.origin}
            Length: ${cat.length}
            Weight: ${cat.min_weight}-${cat.max_weight} lbs
            Life Expectancy: ${cat.min_life_expectancy}-${cat.max_life_expectancy} years
            Intelligence: ${cat.intelligence}/5
            Playfulness: ${cat.playfulness}/5
        `;
    } else if (selectedAPI === "dogs") {
        const dog = data[0];
        return `
            Name: ${dog.name}
            Origin: ${dog.origin || "Unknown"}
            Height: ${dog.height || "Unknown"}
            Weight: ${dog.min_weight}-${dog.max_weight} lbs
            Life Expectancy: ${dog.min_life_expectancy}-${dog.max_life_expectancy} years
            Intelligence: ${dog.intelligence || "Unknown"}/5
            Playfulness: ${dog.playfulness || "Unknown"}/5
        `;
    }
    return "No data available.";
}

function handleApiSubmit() {
    document.getElementById('response_api').textContent = "";
    document.getElementById('error_message').textContent = "";

    const apiInput = document.getElementById('api_input').value.trim();
    if (!apiInput) {
        document.getElementById('error_message').textContent = "Please enter a valid cat or dog breed.";
        return;
    }

    const selectedAPI = Array.from(document.querySelectorAll('#pick_api input[type="checkbox"]'))
        .find((checkbox) => checkbox.checked)?.value;

    if (!selectedAPI) {
        document.getElementById('error_message').textContent = "Please select an API to use.";
        return;
    }

    const fetchUrl = `${BASE_URLS[selectedAPI]}?name=${apiInput}`;

    fetch(fetchUrl, {
        headers: { "X-Api-Key": API_KEY },
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(errorData.error || "An unexpected error occurred.");
                });
            }
            return response.json();
        })
        .then((data) => {
            document.getElementById('response_api').textContent = formatApiResponse(data, selectedAPI);
        })
        .catch((error) => {
            document.getElementById('error_message').textContent = error.message;
        });
}

document.getElementById('submit_button').addEventListener('click', handleApiSubmit);