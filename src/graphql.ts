
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

export class Channel {
    creationDate?: Nullable<Date>;
    creator?: Nullable<User>;
    id: number;
    name?: Nullable<string>;
}

export class Message {
    channel?: Nullable<Channel>;
    content?: Nullable<string>;
    creationDate?: Nullable<Date>;
    id: number;
    sender?: Nullable<User>;
}

export abstract class IMutation {
    abstract postChannel(creatorId: number, name: string): Nullable<Channel> | Promise<Nullable<Channel>>;

    abstract postMessage(channelId: number, content: string, senderId: number): Nullable<Message> | Promise<Nullable<Message>>;
}

export abstract class IQuery {
    abstract channel(id: number): Nullable<Channel> | Promise<Nullable<Channel>>;

    abstract message(id: number): Nullable<Message> | Promise<Nullable<Message>>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class ISubscription {
    abstract messageAdded(channel: string): Nullable<Message> | Promise<Nullable<Message>>;
}

export class User implements Human {
    createdChannels?: Nullable<Nullable<Channel>[]>;
    id: number;
    messages?: Nullable<Nullable<Message>[]>;
    name: string;
}

type Nullable<T> = T | null;
