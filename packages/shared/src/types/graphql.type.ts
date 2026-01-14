import {
  Class,
  RelationType,
  Subject,
  UserInMe,
} from '@stackschool/shared/src';

export interface Context {
  user?: UserInMe;
}

export interface StudentResult {
  id: string;
  matricule: string;
  firstname: string;
  lastname: string;
  photo?: string;
  className?: string;
  relation: RelationType;
}

export interface ClassWithSubjects extends Pick<
  Class,
  'id' | 'name' | 'level' | 'section'
> {
  subjects: Pick<Subject, 'id' | 'name' | 'code'>[];
}
