
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

export class SchoolMembership {
    userId: string;
    user?: Nullable<User>;
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
    firstName: string;
    lastName: string;
    avatarUrl?: Nullable<string>;
    gender?: Nullable<Gender>;
    address?: Nullable<string>;
}

export class ApiResponse {
    ok?: Nullable<boolean>;
    message?: Nullable<string>;
    details?: Nullable<Nullable<string>[]>;
}

export class PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class GenderStats {
    male: number;
    female: number;
}

type Nullable<T> = T | null;
