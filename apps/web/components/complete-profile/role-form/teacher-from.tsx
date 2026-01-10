import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from '@stackschool/ui';

export function TeacherFrom() {
  const { register } = useForm();
  return (
    <div>
      <Field>
        <FieldLabel>Diplôme</FieldLabel>
        <Input />
      </Field>
    </div>
  );
}
