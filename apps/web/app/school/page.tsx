import { CreateInvitationForm } from '@/components/school/create-invitation-form';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/Container';
import ProtectedRoute from '@/components/protected-route';

export default function CreateInvitationPage() {
  return (
    <ProtectedRoute>
      <Container>
        <Card className="">
          <CreateInvitationForm schoolId={'mdmdmddmdmd'} />
        </Card>
      </Container>
    </ProtectedRoute>
  );
}
