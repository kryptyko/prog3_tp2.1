class Customer {
    // contructor para el objeto Customer
    constructor(id, name, email) {
        this.id = id; 
        this.name = name;
        this.email = email;
    }
    //computada para obtener el nombre y el email del cliente
    get info() {
        return `${this.name} (${this.email})`; 
    }
}


/*
Definir una clase `Reservation` en el archivo `reservations.js` que permita representar una reserva.
    - La clase debe tener las siguientes propiedades:
        - `id`: Identificador de la reserva.
        - `customer`: instancia de la clase `Customer` que realiza la reserva.
        - `date`: Fecha y hora de la reserva.
        - `guests`: Número de comensales de la reserva.
    - La clase debe tener un constructor.
    - Se debe implementar una propiedad computada `info` que retorne una cadena con la fecha y hora 
    de la reserva, la información del cliente y el número de comensales.
    - Se debe implementar un método estático `validateReservation` que reciba un objeto con la información 
    de la reserva y retorne `true` si la información es válida y `false` en caso contrario. 
    Si la fecha de la reserva es anterior a la fecha actual y la cantidad de comensales es menor o igual a 0,
     la reserva no es válida.


*/
class Reservation {
    //contructor para el objeto Reservation
    constructor(id, customer, date, guests) {
        this.id = id; 
        this.customer = customer;
        this.date = new Date(date); // Convertir la fecha a objeto Date
        this.guests = guests;
    }
    //computada para obtener la información de la reserva
    get info() {
        return `
        Fecha: ${this.date.toLocaleString()}
        Cliente: ${this.customer.info}
        Comensales: ${this.guests}
        `; 
    }
    //metodo estatico para validar la reserva (verificar que la fecha elegida sea mayor a la fecha actual y que el numero de comensales sea mayor a 0)
    static validateReservation(date, guests) {
        const now = new Date();
        const inputDate = new Date(date);
        return inputDate.getTime() >= now.getTime() && guests > 0;
      }
}

class Restaurant {
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
}

document
    .getElementById("reservation-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();
        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
} else {
    alert("Datos de reserva inválidos");
}
