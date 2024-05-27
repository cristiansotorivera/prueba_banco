import { Router } from "express"; // Importing the Router function from the express module
import { ControllerTransferencias } from "../controllers/transferencia.controller.js"; // Importing the controller for transferencias

const router = Router(); // Creating a new router instance

// Route to get all transferencias
// When a GET request is made to '/transferencias', the getAllTransfer method of ControllerTransferencias is called
router.get('/transferencias', ControllerTransferencias.getAllTransfer);

// Route to create a new transferencia
// When a POST request is made to '/transferencia', the putTransferencia method of ControllerTransferencias is called
router.post('/transferencia', ControllerTransferencias.putTransferencia);

export default router; // Exporting the router to be used in other parts of the application
