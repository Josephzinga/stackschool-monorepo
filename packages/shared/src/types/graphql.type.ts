import { Class, Subject, UserInMe } from '@stackschool/shared/src';

export interface Context {
  user?: UserInMe;
}

export interface ClassWithSubjects extends Pick<
  Class,
  'id' | 'name' | 'level' | 'section'
> {
  subjects: Pick<Subject, 'id' | 'name' | 'code'>[];
}
