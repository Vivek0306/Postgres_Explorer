import express from 'express';
import cors from 'cors';
import { listDatabases, listTables, getTableData, runQuery, listColumns, updateData, deleteData, addData } from './database';

const app = express();
const port = 5252;


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});
  
// Get the Databases from the Postgre Server
app.get('/databases', async (req, res) => {
    try{
        const databases = await listDatabases();
        res.status(200).json(databases);
    }catch(error){
        res.status(500).send("Error fetching the databases..");
    }
});

// Get the Tables from the selected Database
app.get('/tables/:db', async (req, res) => {
    const { db } = req.params;
    try{
        const tables = await listTables(db);
        res.status(200).json(tables);
    }catch(error){
        res.status(500).send(`Error fetching the tables from  ${db}....`);
    }
})

// Get the data from the selected table
app.get('/data', async (req: any, res: any) => {
    const { db, table } = req.query as { db?: string; table?: string };

    if (!db || !table) {
        return res.status(400).send("Please specify both 'db' and 'table' query parameters.");
    }
    try{
        const databases = await getTableData(db, table);
        res.status(200).json(databases);
    }catch(error){
        res.status(500).send("Error fetching the data...");
    }
})

// Get the data from the selected table based on custom query
app.get('/data/custom', async (req: any, res: any) => {
    const { db, table, query } = req.query as { db?: string; table?: string; query?: string };

    if (!db || !table || !query) {
        return res.status(400).send("Please specify 'db', 'table' and 'query', query parameters.");
    }
    try{
        const databases = await runQuery(db, table, query);
        res.status(200).json(databases);
    }catch(error){
        res.status(500).send("Error fetching the data...");
    }
})

// Insert a row into the table
app.post('/data/add', async (req: any, res: any) => {
    const {db, table, record} = req.body;

    if (!db || !table || !record) {
        return res.status(400).send("Invalid request parameters.");
    }
    try{
        const insert = await addData(db, table, record);
        res.status(200).send("Data successfully inserted into the table!");
    }catch(error){
        res.status(500).send("Error inserting the data..." + error);
    }

})

// Update data of a row
app.put("/update", async (req: any, res: any) => {
    const {db, table, id, data, prevId} = req.body;

    if (!db || !table || !id || !data || !prevId){
        return res.status(400).send("Invalid request parameters.");
    }

    try{
        const updatedRecord = await updateData(db, table, id, data, prevId);
        res.status(200).send("Data updated Successfully!");
    }catch(error){
        res.status(500).send(`Data updation for ${table} table failed! ` + error);
    }
})

// Delete the data from the table
app.delete('/delete', async (req: any, res: any) => {
    const {db, table, id, key} = req.query;

    if(!db || !table || !id || !key){
        return res.status(400).send("Invalid request parameters.");
    }

    try{
        const rec = await deleteData(db, table, id, key);
        res.status(200).send("Data deleted successfully!");
    }catch(error){
        res.status(500).send(`Data deletion for ${table} table failed ` + error);
    }
})

// Get the column data of each table
app.get('/columns', async (req: any, res: any) => {
    const { db, table } = req.query as { db?: string; table?: string };

    if (!db || !table) {
        return res.status(400).send("Please specify both 'db' and 'table' query parameters.");
    }

    try {
        const columns = await listColumns(db, table);
        res.status(200).json(columns);
    } catch (error) {
        res.status(500).send(`Error fetching columns for table ${table} in database ${db}`);
    }
});



app.get('/hello', async (req, res) => {
    try{
        res.status(200).send("Hello User");
    }catch(error){
        res.status(500).send("Error fetching the data..");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});