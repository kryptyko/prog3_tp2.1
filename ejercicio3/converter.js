class Currency {
    constructor(code, name) {
        // Constructor que inicializa los atributos code y name de la moneda
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        // Constructor que inicializa la URL de la API y un arreglo vacío para las monedas
        this.apiUrl = apiUrl;
        this.currencies = [];
    }

    getCurrencies() {
        // Realiza una petición a la API para obtener la lista de monedas
        return fetch(`${this.apiUrl}/currencies`)
            .then(response => response.json())
            .then(data => {
                // Recorre las claves del objeto data y crea una instancia de Currency por cada moneda, agregandola al arreglo currencies
                for (const code in data) {
                    this.currencies.push(new Currency(code, data[code]));
                }
            })
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
        // Si la moneda de origen y destino son las mismas, retorna el monto sin cambios
        if (fromCurrency.code === toCurrency.code) {
            return Promise.resolve(amount);
        }
        // Realiza una petición a la API para obtener la conversión de la moneda
        return fetch(
            `${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`
        )
            .then(response => response.json())
            .then(data => data.rates[toCurrency.code])
            
            
    }
    getExchangeRateDifference() {
        const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    
        return fetch(`${this.apiUrl}/${yesterday}..`)
            .then(response => response.json())
            .then(data => {
                const rates = data.rates;
                const yesterdayRates = rates[Object.keys(rates)[0]];
                const todayRates = rates[Object.keys(rates)[1]];
    
                let difference = {};
    
                for (const currencyCode in yesterdayRates) {
                    const yesterdayRate = yesterdayRates[currencyCode];
                    const todayRate = todayRates[currencyCode];
                    difference[currencyCode] = todayRate - yesterdayRate;
                }
    
                return difference;
            })
            
    }
    
    
}

document.addEventListener("DOMContentLoaded", () => {
    // Espera a que el DOM se cargue completamente
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const differencesDiv = document.getElementById("difference");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");
    //const showDifferenceButton = document.getElementById("show-difference"); //boton para mostrar diferencias

    // Crea una instancia de CurrencyConverter con la URL de la API
    const converter = new CurrencyConverter("https://api.frankfurter.app");

    // Obtiene la lista de monedas y llena los selectores de moneda
    converter.getCurrencies().then(() => {
        populateCurrencies(fromCurrencySelect, converter.currencies);
        populateCurrencies(toCurrencySelect, converter.currencies);
    });

    // Agrega un evento al formulario para manejar la conversion de moneda cuando se envía
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Previene el envío del formulario

        const amount = document.getElementById("amount").value; // Obtiene el monto a convertir
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value // Busca la moneda de origen seleccionada
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value // Busca la moneda de destino seleccionada
        );

        
        const convertedAmount = await converter.convertCurrency(amount, fromCurrency, toCurrency);

        // Muestra el resultado de la conversión en el div de resultado
        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${fromCurrency.code} son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }

        // Obtiene y muestra las diferencias de tasa de cambio en un nuevo div creado para tal fin
        const differences = await converter.getExchangeRateDifference();
        if (differences !== null) {
            let result = [];
            for (const currencyCode in differences) {
                result.push(`${currencyCode}: ${differences[currencyCode]}<br>`);
            }
            differencesDiv.innerHTML = result.join(''); //con innerhtml se puede agregar html y usar el salto de linea <br>
        } else {
            differencesDiv.textContent = "Error al obtener las diferencias de tasa de cambio.";
        }
    });

    
    function populateCurrencies(selectElement, currencies) {
        for (let i = 0; i < currencies.length; i++) {
            const option = document.createElement("option");
            option.value = currencies[i].code;
            option.textContent = `${currencies[i].code} - ${currencies[i].name}`;
            selectElement.appendChild(option);
        }
    }
});
