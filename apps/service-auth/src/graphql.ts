
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class SchoolMembership {
    id: string;
}

export abstract class IQuery {
    abstract me(): Nullable<User> | Promise<Nullable<User>>;
}

export class User {
    id: string;
    email?: Nullable<string>;
    username?: Nullable<string>;
    phoneNumber?: Nullable<string>;
    profileCompleted?: Nullable<boolean>;
    hasMembership?: Nullable<boolean>;
    profile?: Nullable<Profile>;
    isActive?: Nullable<boolean>;
    accounts?: Nullable<Nullable<Account>[]>;
}

export class Account {
    id: string;
    provider?: Nullable<string>;
    userId?: Nullable<string>;
}

export class Profile {
    id: string;
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    photo?: Nullable<string>;
    gender?: Nullable<string>;
    address?: Nullable<string>;
}

type Nullable<T> = T | null;
