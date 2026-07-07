import { Class, Subject } from '../../src/index.ts';

export interface Context {
  user?: any;
}

export interface ClassWithSubjects extends Pick<
  Class,
  'id' | 'name' | 'level' | 'section'
> {
  subjects: Pick<Subject, 'id' | 'name' | 'code'>[];
}
