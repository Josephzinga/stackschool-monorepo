'use client';
import { Input } from '@/components/ui/input';
import { parseAsString, useQueryState } from 'nuqs';

export function ClassStudentTableHeader() {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  );
  return (
    <div className="w-full flex items-center mb-4">
      <Input
        className="max-w-80"
        value={search}
        placeholder="Rechercher un élève..."
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
