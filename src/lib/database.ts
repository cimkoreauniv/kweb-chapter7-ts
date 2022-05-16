import mysql from 'mysql2/promise';

const { DB_HOST, DB_PORT_STR, DB_USER, DB_PASS, DB_NAME } = process.env;

const DB_PORT = DB_PORT_STR ? parseInt(DB_PORT_STR) : 3306;

const pool = mysql.createPool({
    host: DB_HOST || 'localhost',
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
});

const runQuery = async <T extends mysql.RowDataPacket[] | mysql.ResultSetHeader>
    (pstmt: string, data?: any[]) => {
    const conn = await pool.getConnection();
    try {
        const sql = conn.format(pstmt, data);
        const [result] = await conn.query<T>(sql);
        return result;
    } finally {
        conn.release();
    }
}

export default runQuery;