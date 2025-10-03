import type { CollectionConfig } from 'payload';
import { canManageUsers, canReadOwnUser, isAdmin } from '../utils/access.js';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: false,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'roles'],
  },
  access: {
    read: ({ req, id }) => {
      if (isAdmin(req.user as any)) return true;
      if (id && req.user?.id === id) return true;
      return false;
    },
    create: canManageUsers,
    update: canReadOwnUser,
    delete: canManageUsers,
  },
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        {
          label: 'Administrator',
          value: 'admin',
        },
        {
          label: 'Church Editor',
          value: 'churchEditor',
        },
      ],
      admin: {
        description: 'Select one or more roles for this user.',
      },
    },
    {
      name: 'assignedChurches',
      label: 'Assigned Churches',
      type: 'relationship',
      relationTo: 'churches',
      hasMany: true,
      required: false,
      admin: {
        condition: (data) => Array.isArray(data?.roles) && data.roles.includes('churchEditor'),
        description: 'Church editors can be limited to specific churches.',
      },
    },
  ],
};
