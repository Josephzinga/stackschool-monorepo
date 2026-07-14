import {
  SchoolUserContract,
  UserWithRelationsContract,
} from '@stackschool/contracts';

export interface GraphQLContext {
  req: Request;
  user: UserWithRelationsContract;
  schoolId?: string;
  schoolUser?: SchoolUserContract;
  teacherId?: string;
  studentId?: string;
  staffId?: string;
}
