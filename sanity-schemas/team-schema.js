export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    {
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility'
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'role',
      title: 'Role/Position',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'industries',
      title: 'Industries',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'locations',
      title: 'Locations (City, Country)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'services',
      title: 'Services/Departments',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
        list: [
          { title: 'Creative Direction', value: 'Creative Direction' },
          { title: 'Production', value: 'Production' },
          { title: 'Post Production', value: 'Post Production' },
          { title: 'Marketing', value: 'Marketing' },
          { title: 'Business Development', value: 'Business Development' },
          { title: 'Operations', value: 'Operations' }
        ]
      },
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'LinkedIn', value: 'LinkedIn' },
                  { title: 'Twitter', value: 'Twitter' },
                  { title: 'Instagram', value: 'Instagram' },
                  { title: 'Facebook', value: 'Facebook' },
                  { title: 'YouTube', value: 'YouTube' },
                  { title: 'Vimeo', value: 'Vimeo' },
                  { title: 'Behance', value: 'Behance' },
                  { title: 'Dribbble', value: 'Dribbble' }
                ]
              }
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.uri({
                scheme: ['http', 'https']
              })
            },
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Icon identifier for the platform'
            }
          ]
        }
      ]
    },
    {
      name: 'bioTitle',
      title: 'Bio Title',
      type: 'string',
      description: 'Optional title for the bio section. If empty, the role will be used.'
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required()
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order for displaying team members (lower numbers appear first)'
    }
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'role',
      media: 'image'
    }
  },
  orderings: [
    {
      title: 'Order',
      name: 'order',
      by: [
        { field: 'order', direction: 'asc' },
        { field: '_createdAt', direction: 'asc' }
      ]
    }
  ]
};
