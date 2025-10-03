import type { PayloadRequest } from 'payload/types';

export type AppUser = {
  id: string;
  email?: string;
  roles?: string[];
  assignedChurches?: (string | { id: string })[];
};

export type AccessArgs<TUser = AppUser> = {
  req: PayloadRequest<TUser>;
  id?: string | number;
  doc?: Record<string, unknown> | null;
};

const normalizeRelationshipIDs = (values?: (string | { id: string })[]) => {
  if (!values) return [] as string[];
  return values
    .map((value) => (typeof value === 'string' ? value : value?.id))
    .filter((value): value is string => Boolean(value));
};

export const hasRole = (user: AppUser | null | undefined, role: string): boolean => {
  return Boolean(user?.roles?.includes(role));
};

export const isAdmin = (user: AppUser | null | undefined): boolean => hasRole(user, 'admin');

export const isEditor = (user: AppUser | null | undefined): boolean => hasRole(user, 'churchEditor');

export const canManageUsers = ({ req }: AccessArgs<AppUser>): boolean => {
  return isAdmin(req.user);
};

export const canReadOwnUser = ({ req, id }: AccessArgs<AppUser>): boolean => {
  if (!req.user) return false;
  if (isAdmin(req.user)) return true;
  return req.user.id === id;
};

export const canManageChurch = ({ req, id, doc }: AccessArgs<AppUser>): boolean => {
  const user = req.user;
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (!isEditor(user)) return false;

  const assigned = normalizeRelationshipIDs(user.assignedChurches);
  if (!assigned.length) return false;

  if (typeof id === 'string') {
    return assigned.includes(id);
  }

  if (doc && typeof doc.id === 'string') {
    return assigned.includes(doc.id);
  }

  return false;
};

export const canCreateChurch = ({ req }: AccessArgs<AppUser>): boolean => {
  const user = req.user;
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (!isEditor(user)) return false;
  return true;
};

export const canUploadMedia = ({ req }: AccessArgs<AppUser>): boolean => {
  const user = req.user;
  if (!user) return false;
  return isAdmin(user) || isEditor(user);
};

export const transformStatusForEditors = <T extends { _status?: string }>(data: T, user: AppUser | null | undefined): T => {
  if (!user) return data;
  if (isAdmin(user)) return data;

  if (isEditor(user)) {
    return {
      ...data,
      _status: 'draft',
    };
  }

  return data;
};
