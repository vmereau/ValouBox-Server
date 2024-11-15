
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Human {
    name: string;
}

export class Message {
    channel?: Nullable<string>;
    content?: Nullable<string>;
    creationDate?: Nullable<Date>;
    id: number;
    sender?: Nullable<User>;
}

export abstract class IMutation {
    abstract postMessage(channel: string, content: string, senderId: number): Nullable<Message> | Promise<Nullable<Message>>;
}

export abstract class IQuery {
    abstract message(id: number): Nullable<Message> | Promise<Nullable<Message>>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class ISubscription {
    abstract messageAdded(channel: string): Nullable<Message> | Promise<Nullable<Message>>;
}

export class User implements Human {
    id: number;
    messages?: Nullable<Nullable<Message>[]>;
    name: string;
}

type Nullable<T> = T | null;
