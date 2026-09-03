import { Resolver } from '@nestjs/graphql';
import { ParentService } from './parent.service';

@Resolver('Parent')
export class ParentResolver {
  constructor(private readonly parentService: ParentService) {}
}
