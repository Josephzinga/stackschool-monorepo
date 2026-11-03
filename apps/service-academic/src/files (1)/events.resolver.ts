// service-academic/src/events/events.resolver.ts

import { Query, Resolver, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SchoolEvent, SchoolEventsInput, EventAudience } from './event.types';
import { CaslAbilityGuard } from '@stackschool/shared/casl/nestjs/casl-ability.guard';
import { RequireAbility } from '@stackschool/shared/casl/nestjs/require-ability.decorator';
import { CurrentSchoolUser } from '../auth/current-school-user.decorator'; // adjust to your actual path

// Maps a SchoolUser's role to the audiences they should see. ALL is always
// included — that's the "school-wide" bucket every role sees.
const AUDIENCE_BY_ROLE: Record<string, EventAudience[]> = {
  TEACHER: [EventAudience.ALL, EventAudience.TEACHERS, EventAudience.STAFF],
  PARENT: [EventAudience.ALL, EventAudience.PARENTS],
  STUDENT: [EventAudience.ALL, EventAudience.STUDENTS],
  ADMIN: Object.values(EventAudience), // sees everything
  SECRETARY: [EventAudience.ALL, EventAudience.STAFF],
};

@Resolver(() => SchoolEvent)
@UseGuards(CaslAbilityGuard)
export class EventsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [SchoolEvent])
  @RequireAbility('read', 'SchoolSettings') // adjust once you decide whether
  // events need their own PermissionSubject rather than piggybacking on
  // SchoolSettings — fine as a placeholder for now, but worth revisiting
  // once you have a real "who can manage the school calendar" rule.
  async schoolEvents(
    @Args('input') input: SchoolEventsInput,
    @CurrentSchoolUser() schoolUser: { role: string },
  ) {
    // Filtering by audience happens here, not in the frontend — a parent's
    // browser should never even receive a STAFF-only event to begin with.
    const allowedAudiences = AUDIENCE_BY_ROLE[schoolUser.role] ?? [EventAudience.ALL];

    return this.prisma.event.findMany({
      where: {
        schoolId: input.schoolId,
        audience: { in: allowedAudiences },
        // Overlap with [from, to], not just startAt inside the range —
        // otherwise a multi-day event that started before `from` and ends
        // inside the window silently disappears from the widget.
        OR: [
          { startAt: { gte: input.from, lte: input.to } },
          { endAt: { gte: input.from, lte: input.to } },
          { AND: [{ startAt: { lte: input.from } }, { endAt: { gte: input.to } }] },
        ],
      },
      orderBy: { startAt: 'asc' },
    });
  }
}
