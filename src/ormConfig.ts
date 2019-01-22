import { ConnectionOptions } from "typeorm"

const connectionOptions:ConnectionOptions = {
    type: "postgres",
    database: "nuber",
    synchronize: true,
    logging: true,
    entities: ["entities/*.*"],
    host: process.env.DB_ENDPOINT || "localhost",
    port: 5432,
    username: process.env.DB_USERNAME || "danny",
    password: process.env.DB_PASSWORD || "1234"
}


export default connectionOptions;

// psql -U postgres -h localhost -W