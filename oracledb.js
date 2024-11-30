const oracledb = require("oracledb");
const cors = require('cors');
const express = require('express');
const app = express();

// Enable CORS for all origins (you can customize this later)
app.use(cors());


app.get('/api/users/', async (req, res) => {

    const results = await run();
    res.status(200).json(results);
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "hr",   // Usuario
            password: "hr",    // Contraseña
            connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=orcl)))",    // Alias en tnsnames.ora
        });

        console.log("Successfully connected to Oracle Database");

        // Select data
        const result = await connection.execute(
            `SELECT * FROM EMPLOYEES`, // Consulta
            [],                        // Parámetros opcionales (vacío en este caso)
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // Resultado como objetos clave-valor
        );

        // Mostrar resultados
        // console.log("Query Results:");
        // result.rows.forEach(row => {
        //     console.log(row);
        // });

        return result.rows;

    } catch (err) {
        console.error("Error: ", err);
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log("Connection closed");
            } catch (err) {
                console.error("Error closing connection: ", err);
            }
        }
    }
}

