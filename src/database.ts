import { userInfo } from 'os';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectPostgres = (db: string) => {
    return new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: db
    });
}

export const listDatabases = async () => {
    const client = connectPostgres('postgres');
    await client.connect();
    try{
        const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
        return res.rows.map((row: any) => row.datname);
    } catch(error){
        throw new Error('Error fetching databases: ' + error);
    } finally{
        await client.end();
    };
}

export const listTables = async (db: string) => {
    const client = connectPostgres(db);
    await client.connect();
    try{
        const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
        return res.rows.map((row: any) => row.table_name);
    }catch (error){
        throw new Error('Error fething table names: ' + error);
    }finally{
        await client.end();
    };
}

export const getTableData = async (db: string, table: string) => {
    const client = connectPostgres(db);
    await client.connect();
    try{
        const res = await client.query(`SELECT * FROM ${table}`);
        return res.rows;
    }catch (error){
        throw new Error('Error fething data from the table: ' + error);
    }finally{
        await client.end();
    };
}

export const runQuery = async (db:string, query: string) => {
    const client = connectPostgres(db);
    await client.connect()
    try{
        const res = await client.query(`${query}`);
        return res.rows;
    }catch (error){
        throw new Error('Error fething data from the table: ' + error);
    }finally{
        await client.end();
    };
}

export const listColumns = async (database: string, table: string) => {
    const client = connectPostgres(database);
    await client.connect();

    try {
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = $1 AND table_schema = 'public'
        `, [table]);
        
        const result = res.rows.map((obj) => {
            return obj.column_name;
        }).reduce((obj, key) => {
            obj[key] = 0;
            return obj;
        }, {})

        return result;
    } catch (error) {
        throw new Error(`Error fetching columns for table ${table}: ${error}`);
    } finally {
        await client.end();
    }
};

export const addData = async (database:string, table: string, record: any) => {
    const client = connectPostgres(database);
    await client.connect();

    try{
        const keys = Object.keys(record);
        const values = Object.values(record);
        const val_place = values.map((_, index) => {
            return `$${index + 1}`
        }).join(",");
        const query = `INSERT INTO ${table} (${keys}) VALUES (${val_place})`;
        const res = await client.query(query, values);

        return res.rows[0];

    } catch (error){
        throw new Error(`Error inserting row into ${table} table: ${error}`);
    } finally{
        await client.end();
    }
}


export const updateData = async (database: string, table: string, id: string, record: any, prev_id: string) => {
    const client = connectPostgres(database);
    await client.connect();

    try {
        delete record.prev_id;
        const clause = Object.keys(record).map((key, index) => {
            return `${key}=$${index + 1}`;
        }).join(",");
        const pkey = {'key':Object.keys(record)[0], 'value': record[Object.keys(record)[0]]};
        const query = `UPDATE ${table} SET ${clause} WHERE ${pkey.key} = ${prev_id}`
        const values = Object.values(record);
        const res = await client.query(query, values);
        return res.rows[0];
    } catch (error) {
        throw new Error(`Error fetching columns for table ${table}: ${error}`);
    } finally {
        await client.end();
    }
}

export const deleteData = async (database: string, table: string, id: string, key: any) => {
    const client = connectPostgres(database);
    await client.connect();

    try{
        const query = `DELETE FROM ${table} WHERE ${key} = $1`;
        const res = await client.query(query, [id]);
        return res;
    } catch (error){
        throw new Error(`Error deleting row from ${table} table: ${error}`);
    } finally{
        await client.end();
    }
}