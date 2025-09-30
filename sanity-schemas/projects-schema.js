import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'fullTitle',
      title: 'Full Title',
      type: 'string',
      description: 'Complete title for detailed view',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
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
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'person',
              title: 'Person',
              type: 'string',
              description: 'Can be selected from team members or entered manually',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'award',
              title: 'Award',
              type: 'reference',
              to: [{type: 'award'}],
              description: 'Optional award for this credit'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'images',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
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
          ]
        }
      ],
      description: 'Additional images for the project gallery'
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'project'}]
        }
      ],
      description: 'Select related projects to show at the bottom'
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order for displaying projects (lower numbers appear first)'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
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
})
