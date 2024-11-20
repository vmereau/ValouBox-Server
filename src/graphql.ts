
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ChannelUpdateType {
    NEW_MESSAGE = "NEW_MESSAGE",
    USER_LIST_UPDATE = "USER_LIST_UPDATE"
}

export interface Human {
    name: string;
}

export class Channel {
    creationDate?: Nullable<Date>;
    creator?: Nullable<User>;
    id: number;
    name?: Nullable<string>;
}

export class ChannelUpdate {
    channelId: number;
    newMessage?: Nullable<Message>;
    updateType: ChannelUpdateType;
    userList?: Nullable<Nullable<User>[]>;
}

export class Message {
    channel?: Nullable<Channel>;
    content?: Nullable<string>;
    creationDate?: Nullable<Date>;
    id: number;
    sender?: Nullable<User>;
}

export abstract class IMutation {
    abstract postChannel(name: string): Nullable<Channel> | Promise<Nullable<Channel>>;

    abstract postMessage(channelId: number, content: string): Nullable<Message> | Promise<Nullable<Message>>;
}

export abstract class IQuery {
    abstract channel(id: number): Nullable<Channel> | Promise<Nullable<Channel>>;

    abstract message(id: number): Nullable<Message> | Promise<Nullable<Message>>;

    abstract user(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class ISubscription {
    abstract channel(channelId: number): Nullable<ChannelUpdate> | Promise<Nullable<ChannelUpdate>>;
}

export class User implements Human {
    createdChannels?: Nullable<Nullable<Channel>[]>;
    id: number;
    messages?: Nullable<Nullable<Message>[]>;
    name: string;
}

type Nullable<T> = T | null;
