import { ResultSetHeader, RowDataPacket } from "mysql2";
import runQuery from "../lib/database";

export const getByUsername = async (username: string) => {
    const sql = 'SELECT id, password, display_name AS displayName, '
        + 'is_active as isActive, is_staff AS isStaff ' +
        'FROM `users` WHERE `username`=?';
    return (await runQuery<RowDataPacket[]>(sql, [username]))[0]; ``
};

export const create = async (username: string, password: string, displayName: string) => {
    const sql = 'INSERT INTO `users` (username, password, display_name)' +
        ' VALUES (?, ?, ?)';
    await runQuery<ResultSetHeader>(sql, [username, password, displayName]);
};