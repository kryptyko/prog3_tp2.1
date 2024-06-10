
//implementacion nueva
class Sensor {
    //Para seguir en linea con la nomenclatura en ingles, se usaran los atributos en ingles
    constructor(id, name, type, value, unit, updated_at) {
        this.id = id; // Identificador del sensor
        this.name = name; // Nombre del sensor
        this.type = type; // Tipo del sensor
        this.value = value; // Valor del sensor
        this.unit = unit; // Unidad de medida del sensor
        this.updated_at = updated_at; // Fecha de actualizacion del sensor
    }

    // Setter para actualizar el valor del sensor y la fecha de actualizacion
    set updateValue(newValue) {
        this.value = newValue; // Actualiza el valor del sensor
        this.updated_at = new Date().toISOString(); // Actualiza la fecha de actualizacion al momento actual
    }
}
//fin implementacion nueva

class SensorManager {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();tc
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

    async loadSensors(url) {
        
            const response = await fetch(url); // Realiza la petición fetch al archivo JSON
            const data = await response.json(); // Convierte la respuesta a JSON
            data.forEach((sensorData) => {
                // Crea instancias de la clase Sensor con los datos del JSON
                const sensor = new Sensor(
                    sensorData.id,
                    sensorData.name,
                    sensorData.type,
                    sensorData.value,
                    sensorData.unit,
                    sensorData.updated_at
                );
                this.addSensor(sensor); // Agrega el sensor a la colección
            });
            this.render(); // Muestra los sensores en la página
        
    }

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }
}

const monitor = new SensorManager();

monitor.loadSensors("sensors.json");
