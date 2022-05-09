import runQuery from "../lib/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const formatDate = (date: Date): string => {
    const yr = date.getFullYear();
    const mon = date.getMonth() + 1;
    const dt = date.getDate();
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();
    return `${yr}. ${mon}. ${dt} ${hrs}:${mins}:${secs}`;
}

const replaceDate = (article: RowDataPacket): RowDataPacket => {
    if (article) {
        article.createdAt = formatDate(article.createdAt);
        article.lastUpdated = formatDate(article.lastUpdated);
    }
    return article;
}

export const getList = async (start: number, count: number) => {
    const sql = 'SELECT articles.id, title, created_at AS createdAt,'
        + ' last_updated AS lastUpdated, users.display_name AS displayName'
        + ' FROM articles INNER JOIN users ON articles.author=users.id'
        + ' WHERE articles.is_active=1 AND articles.is_deleted=0'
        + ' ORDER BY articles.id DESC LIMIT ?, ?';
    const ret = await runQuery<RowDataPacket[]>(sql, [start, count]);
    ret.forEach(replaceDate);
    return ret;
};

export const getTotalCount = async (): Promise<number> => {
    const sql = 'SELECT Count(*) AS cnt FROM articles WHERE is_active=1 AND is_deleted=0';
    const { cnt } = (await runQuery<RowDataPacket[]>(sql))[0];
    return cnt;
};

export const getById = async (id: number) => {
    const sql = 'SELECT articles.id, `title`, content, created_at AS createdAt,'
        + ' last_updated AS lastUpdated, author, users.display_name AS displayName'
        + ' FROM articles INNER JOIN users ON articles.author=users.id'
        + ' WHERE articles.id=? AND articles.is_active=1 AND articles.is_deleted=0';
    return replaceDate((await runQuery<RowDataPacket[]>(sql, [id]))[0]);
};

export const getByIdAndAuthor = async (id: number, author: any) => {
    const sql = 'SELECT title, content, author, created_at AS createdAt, last_updated AS lastUpdated'
        + ' FROM articles WHERE id=? AND author=? AND is_active=1 AND is_deleted=0';
    return replaceDate((await runQuery<RowDataPacket[]>(sql, [id, author.id]))[0]);
};

export const create = async (title: string, content: string, author: any) => {
    const sql = 'INSERT INTO articles (title, content, author)'
        + ' VALUES (?, ?, ?)';
    const result = await runQuery<ResultSetHeader>(sql, [title, content, author.id]);
    return result.insertId;
};

export const update = async (id: number, title: string, content: string) => {
    const sql = 'UPDATE articles SET title=?, content=? WHERE id=?';
    await runQuery(sql, [title, content, id]);
};

export const remove = async (id: number) => {
    const sql = 'UPDATE articles SET is_deleted=1 WHERE id=?';
    await runQuery(sql, [id]);
};