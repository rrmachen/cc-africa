import type { CollectionConfig } from 'payload/types';
import {
  AppUser,
  canCreateChurch,
  canManageChurch,
  isAdmin,
  transformStatusForEditors,
} from '../utils/access';

export const Churches: CollectionConfig = {
  slug: 'churches',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location.country', 'location.city', 'status', '_status'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  access: {
    read: () => true,
    create: canCreateChurch,
    update: canManageChurch,
    delete: ({ req }) => isAdmin(req.user as AppUser),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Church Name',
      required: true,
    },
    {
      name: 'foundedDate',
      type: 'date',
      label: 'Founded Date',
    },
    {
      name: 'denominationAffiliation',
      type: 'text',
      label: 'Denomination / Affiliation',
    },
    {
      name: 'location',
      type: 'group',
      label: 'Location',
      fields: [
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'region',
          label: 'Region / State / Province',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'streetAddress',
          type: 'text',
        },
        {
          name: 'coordinates',
          type: 'point',
          label: 'Coordinates',
          required: false,
        },
      ],
    },
    {
      name: 'history',
      type: 'richText',
      label: 'Church History',
      required: false,
    },
    {
      name: 'leadership',
      type: 'group',
      label: 'Leadership',
      fields: [
        {
          name: 'elders',
          type: 'array',
          label: 'Elders',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'email',
              type: 'email',
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'preachers',
          type: 'array',
          label: 'Preachers / Ministers',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'role',
              type: 'text',
              required: true,
            },
            {
              name: 'email',
              type: 'email',
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'contactInformation',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'mainPhone',
          type: 'text',
          label: 'Main Phone',
        },
        {
          name: 'mainEmail',
          type: 'email',
          label: 'Main Email',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website',
        },
      ],
    },
    {
      name: 'meetingTimes',
      type: 'array',
      label: 'Meeting Times',
      fields: [
        {
          name: 'day',
          type: 'select',
          options: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Varies',
          ].map((label) => ({ label, value: label.toLowerCase() })),
          required: true,
        },
        {
          name: 'time',
          type: 'text',
          required: true,
        },
        {
          name: 'gatheringType',
          label: 'Gathering Type',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'media',
      type: 'group',
      label: 'Media',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Church Photo / Logo',
        },
        {
          name: 'gallery',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          label: 'Photo Gallery',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Publication status is managed via approval workflow.',
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const nextData = transformStatusForEditors(data, req.user as AppUser | null | undefined);
        if (req.user) {
          nextData.updatedBy = req.user.id;
        }
        if (nextData._status === 'published') {
          nextData.status = 'published';
        } else {
          nextData.status = 'draft';
        }
        return nextData;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const userLabel = req.user?.email || req.user?.id || 'system';
        if (previousDoc?._status !== doc._status) {
          req.payload.logger.info(
            `[moderation] ${userLabel} updated publication status for "${doc.name}" to ${doc._status}`,
          );
        } else {
          req.payload.logger.info(
            `[moderation] ${userLabel} updated "${doc.name}" (${doc._status ?? 'draft'})`,
          );
        }
      },
    ],
  },
};
