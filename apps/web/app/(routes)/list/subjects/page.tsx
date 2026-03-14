import { SubjectTableProvider } from '@/components/school/subject/table/table-provider';
import { SubjectView } from '@/app/(routes)/list/subjects/subject-view';

function SubjectsPage() {
  return (
    <SubjectTableProvider>
      <SubjectView />
    </SubjectTableProvider>
  );
}

export default SubjectsPage;
