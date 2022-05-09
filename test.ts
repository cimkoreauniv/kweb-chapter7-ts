import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'kwebuser', 
    password: 'kwebpw',
    database: 'kweb_chap7'
});

interface User extends mysql.RowDataPacket{
    username: string,
    display_name: string,
    foo: string
};

(async () => {
    const conn = await pool.getConnection();
    
    const [result] = await conn.query<User[]>('SELECT username, display_name FROM users WHERE id=1');
    console.log(result);
    console.log(result[0].foo);

    conn.release();
})();
