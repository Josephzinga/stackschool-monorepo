import { SetMetadata } from '@nestjs/common';
import { PermissionCode } from '../../graphql/graphql';

export const PERMISSIONS_KEY = 'permissions';
export const PERMISSIONS_STRATEGY = 'permissionsStrategy';

/** AND = toutes les permissions requises, OR = au moins une (défaut). */
export type PermissionStrategy = 'AND' | 'OR';

/**
 * @Permissions('MARK_STUDENT_ATTENDANCE')
 * @Permissions('EDIT_GRADES', 'VIEW_GRADES', { strategy: 'AND' })
 */
export const Permissions = (
  ...args:
    | [PermissionCode, ...PermissionCode[]]
    | [PermissionCode[], { strategy?: PermissionStrategy }]
) => {
  // Signature souple : accepte soit des codes en spread, soit un tableau.
  if (Array.isArray(args[0])) {
    const [codes, opts] = args as [
      PermissionCode[],
      { strategy?: PermissionStrategy },
    ];
    SetMetadata(PERMISSIONS_STRATEGY, opts?.strategy ?? 'OR')(null as never);
    return SetMetadata(PERMISSIONS_KEY, codes);
  }
  const codes = args.filter((a): a is PermissionCode => typeof a === 'string');
  const opts = args.find((a) => typeof a === 'object') as
    { strategy?: PermissionStrategy } | undefined;
  SetMetadata(PERMISSIONS_STRATEGY, opts?.strategy ?? 'OR')(null as never);
  return SetMetadata(PERMISSIONS_KEY, codes);
};
