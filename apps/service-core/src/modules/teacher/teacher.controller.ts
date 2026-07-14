import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller()
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @MessagePattern('createTeacher')
  create(@Payload() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @MessagePattern('findAllTeacher')
  findAll() {
    return this.teacherService.findAll();
  }

  @MessagePattern('findOneTeacher')
  findOne(@Payload() id: number) {
    return this.teacherService.findOne(id);
  }

  @MessagePattern('updateTeacher')
  update(@Payload() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(updateTeacherDto.id, updateTeacherDto);
  }

  @MessagePattern('removeTeacher')
  remove(@Payload() id: number) {
    return this.teacherService.remove(id);
  }
}
