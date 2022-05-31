import { RowDataPacket } from "mysql2/promise";

export interface Article extends RowDataPacket
{
    id: number,
    title: string,
    content: string,
    createdAtDate: Date,
    createdAt: string,
    lastUpdatedDate: Date,
    lastUpdated: string
    author: number,
    displayName: string,
}

export interface User extends RowDataPacket
{
    id: number,
    password: string,
    displayName: string,
    isActive: number,
    isStaff: number
}