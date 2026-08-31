import { Container } from '@/components/Container';
import { CreateInvitationForm } from '@/components/lists/create-invitation-form';
import { Card } from '@/components/ui/card';

export default function CreateInvitation() {
  return (
    <Container>
      <Card>
        <CreateInvitationForm schoolId="cmkfkbtoy00003pqhbh6nn8ch" />
      </Card>
    </Container>
  );
}
