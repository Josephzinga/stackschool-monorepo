
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export interface SchoolMembership {
    id: string;
}

export interface IQuery {
    me(): Nullable<User> | Promise<Nullable<User>>;
}

export interface User {
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

export interface Account {
    id: string;
    provider?: Nullable<string>;
    userId?: Nullable<string>;
}

export interface Profile {
    id: string;
    firstname: string;
    lastname: string;
    photo?: Nullable<string>;
    gender: Gender;
    address?: Nullable<string>;
}

type Nullable<T> = T | null;
