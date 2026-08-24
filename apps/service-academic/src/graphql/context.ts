export interface GraphQLContext {
  req: Request;
  user: Request;
  schoolId?: string;
  schoolUser?: SchoolUserContract;
  teacherId?: string;
  studentId?: string;
  staffId?: string;
}

export const createGraphqlContext = ({ req, res }) => {};
