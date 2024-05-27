// Function to set the information in the modal for editing a user
const setInfoModal = (nombre, balance, id) => {
    // Set the value of the "nombre" input field in the modal
    $("#nombreEdit").val(nombre);
    // Set the value of the "balance" input field in the modal
    $("#balanceEdit").val(balance);
    // Set the onclick attribute of the "editButton" to call the editUsuario function with the user's id
    $("#editButton").attr("onclick", `editUsuario('${id}')`);
};

// Function to edit a user with the given id
const editUsuario = async (id) => {
    // Get the values from the modal's input fields
    const name = $("#nombreEdit").val();
    const balance = $("#balanceEdit").val();

    // Validate that the name and balance are not empty
    if (!name.trim() || !balance.trim()) {
        alert("El nombre y el balance no pueden estar vacíos.");
        return;
    }

    // Validate that the balance is a number
    if (isNaN(balance)) {
        alert("El balance debe ser un número.");
        return;
    }
    
    try {
        // Make a PUT request to update the user's information
        const { data } = await axios.put(
            `http://localhost:3000/usuario?id=${id}`,
            { name, balance }
        );
        // Hide the modal after the update
        $("#exampleModal").modal("hide");
        // Reload the page to reflect the changes
        location.reload();
    } catch (e) {
        // Alert the user if there is an error
        alert("Algo salió mal..." + e);
    }
};

// Form submission handler for creating a new user
$("form:first").submit(async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the form input fields
    let nombre = $("form:first input:first").val();
    let balance = $("form:first input:nth-child(2)").val();

    // Validate that balance is a number
    if (isNaN(balance) || balance.trim() === "") {
        alert("El balance debe ser un número");
        return;
    }

    balance = Number(balance); // Convert balance to a number

    try {
        // Make a POST request to create a new user
        const response = await fetch("http://localhost:3000/usuario", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, balance })
        });
        // Clear the form input fields after submission
        $("form:first input:first").val("");
        $("form:first input:nth-child(2)").val("");
        // Reload the page to reflect the changes
        location.reload();
    } catch (e) {
        // Alert the user if there is an error
        alert("Algo salió mal ..." + e);
    }
});

// Form submission handler for making a transfer
$("form:last").submit(async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the form input fields
    let emisor = $("form:last select:first").val();
    let receptor = $("form:last select:last").val();
    let monto = $("#monto").val();

    // Validate that all fields are filled
    if (!monto || !emisor || !receptor) {
        alert("completar todos los datos");
        return false;
    }

    // Validate that the sender and receiver are not the same
    if (emisor === receptor) {
        alert("El emisor y el receptor deben ser distintos");
        return false;
    }

    try {
        // Make a POST request to create a new transfer
        const response = await fetch("http://localhost:3000/transferencia", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emisor, receptor, monto })
        });
        const data = await response.json();
        // Reload the page to reflect the changes
        location.reload();
    } catch (e) {
        console.log(e); // Log the error
        alert("error" + e); // Alert the user if there is an error
    }
});

// Function to fetch and display the list of users
const getUsuarios = async () => {
    const response = await fetch("http://localhost:3000/usuarios");
    let data = await response.json();
    $(".usuarios").html(""); // Clear the current user list

    $.each(data, (i, c) => {
        // Format the balance as CLP currency
        const balanceFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(c.balance);

        // Append each user to the user table
        $(".usuarios").append(`
              <tr>
                <td>${c.nombre}</td>
                <td>${balanceFormateado}</td>
                <td>
                  <button
                    class="btn btn-warning mr-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onclick="setInfoModal('${c.nombre}', '${c.balance}', '${c.id}')"
                  >
                    Editar
                  </button>
                  <button class="btn btn-danger" onclick="eliminarUsuario('${c.id}')">Eliminar</button>
                </td>
              </tr>
         `);

        // Append each user to the sender and receiver dropdowns
        $("#emisor").append(`<option value="${c.id}">${c.nombre}</option>`);
        $("#receptor").append(`<option value="${c.id}">${c.nombre}</option>`);
    });
};

// Function to delete a user by id
const eliminarUsuario = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este usuario?");

    if (!confirmacion) {
        return; // If the user cancels, do nothing
    }
    await fetch(`http://localhost:3000/usuario?id=${id}`, { method: "DELETE" });
    getUsuarios(); // Refresh the user list
};

// Function to fetch and display the list of transfers
const getTransferencias = async () => {
    const { data } = await axios.get("http://localhost:3000/transferencias");
    $(".transferencias").html(""); // Clear the current transfer list

    data.forEach((t) => {
        // Format the amount as CLP currency
        const balanceFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(t.monto);

        // Append each transfer to the transfer table
        $(".transferencias").append(`
       <tr>
         <td>${formatDate(t[4])}</td>
         <td>${t.emisor_nombre}</td>
         <td>${t.receptor_nombre}</td>
         <td>${balanceFormateado}</td>
       </tr>
     `);
    });
};

// Fetch the user and transfer data when the page loads
getUsuarios();
getTransferencias();

// Function to format a date using moment.js
const formatDate = (date) => {
    const dateFormat = moment(date).format("L");
    const timeFormat = moment(date).format("LTS");
    return `${dateFormat} ${timeFormat}`;
};

// Call the formatDate function (though this call might be redundant as it isn't being used here)
formatDate();
