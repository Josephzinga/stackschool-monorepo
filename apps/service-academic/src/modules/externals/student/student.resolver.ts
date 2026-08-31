import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Class, Student } from '../../../graphql';
import { ClassService } from '../../class/class.service';

@Resolver('Student')
export class StudentResolver {
  constructor(private readonly classService: ClassService) {}

  @ResolveField('schoolClass')
  async getClass(@Parent() student: Student): Promise<Class | null> {
    console.log('Academic student', student);
    const classe = await this.classService.findOne(student.classId);
    return classe;
  }
}
