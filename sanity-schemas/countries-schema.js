export default {
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Country Name',
      type: 'string',
      description: 'e.g., France, UK, etc.',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'code',
      title: 'Country Code',
      type: 'string',
      description: 'e.g., fr, uk, etc. (used for navigation)',
      validation: (Rule) => Rule.required().max(10)
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Brief description of the country\'s tax rebate program',
      validation: (Rule) => Rule.max(200)
    },
    {
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'introSection',
          title: 'Intro Section',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: (Rule) => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description'
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: selection.subtitle?.substring(0, 100) + '...'
              }
            }
          }
        },
        {
          type: 'object',
          name: 'eligibleExpensesSection',
          title: 'Eligible Expenses Section',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Eligible expenses include:',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'points',
              title: 'List of Points',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'expensePoint',
                  title: 'Expense Point',
                  fields: [
                    {
                      name: 'point',
                      title: 'Point',
                      type: 'string',
                      validation: (Rule) => Rule.required()
                    },
                    {
                      name: 'description',
                      title: 'Description (optional)',
                      type: 'text'
                    }
                  ],
                  preview: {
                    select: {
                      title: 'point'
                    }
                  }
                }
              ],
              validation: (Rule) => Rule.required().min(1)
            }
          ],
          preview: {
            select: {
              title: 'title',
              points: 'points'
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: `${selection.points?.length || 0} points`
              }
            }
          }
        },
        {
          type: 'object',
          name: 'qualifyingRequirementsSection',
          title: 'Qualifying Requirements Section',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Qualifying requirements',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'points',
              title: 'List of Requirements',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'requirementPoint',
                  title: 'Requirement Point',
                  fields: [
                    {
                      name: 'requirement',
                      title: 'Requirement',
                      type: 'string',
                      validation: (Rule) => Rule.required()
                    },
                    {
                      name: 'description',
                      title: 'Description (optional)',
                      type: 'text'
                    }
                  ],
                  preview: {
                    select: {
                      title: 'requirement'
                    }
                  }
                }
              ],
              validation: (Rule) => Rule.required().min(1)
            }
          ],
          preview: {
            select: {
              title: 'title',
              points: 'points'
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: `${selection.points?.length || 0} requirements`
              }
            }
          }
        },
        {
          type: 'object',
          name: 'howToApplySection',
          title: 'How to Apply Section',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'How to apply?',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'points',
              title: 'Application Steps',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'applicationStep',
                  title: 'Application Step',
                  fields: [
                    {
                      name: 'step',
                      title: 'Step',
                      type: 'string',
                      validation: (Rule) => Rule.required()
                    },
                    {
                      name: 'description',
                      title: 'Description (optional)',
                      type: 'text'
                    }
                  ],
                  preview: {
                    select: {
                      title: 'step'
                    }
                  }
                }
              ],
              validation: (Rule) => Rule.required().min(1)
            }
          ],
          preview: {
            select: {
              title: 'title',
              points: 'points'
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: `${selection.points?.length || 0} steps`
              }
            }
          }
        },
        {
          type: 'object',
          name: 'customContentSection',
          title: 'Custom Content Section',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'content',
              title: 'Additional Content',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'H1', value: 'h1'},
                    {title: 'H2', value: 'h2'},
                    {title: 'H3', value: 'h3'},
                    {title: 'H4', value: 'h4'},
                    {title: 'Quote', value: 'blockquote'},
                  ],
                  lists: [
                    {title: 'Bullet', value: 'bullet'},
                    {title: 'Number', value: 'number'}
                  ],
                  marks: {
                    decorators: [
                      {title: 'Strong', value: 'strong'},
                      {title: 'Emphasis', value: 'em'},
                      {title: 'Code', value: 'code'}
                    ],
                    annotations: [
                      {
                        title: 'URL',
                        name: 'link',
                        type: 'object',
                        fields: [
                          {
                            title: 'URL',
                            name: 'href',
                            type: 'url'
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description'
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: selection.subtitle?.substring(0, 100) + '...'
              }
            }
          }
        }
      ],
      validation: (Rule) => Rule.required().min(1)
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Contact Email',
          type: 'string',
          description: 'Email for this country\'s tax rebate inquiries'
        },
        {
          name: 'phone',
          title: 'Contact Phone',
          type: 'string',
          description: 'Phone number for inquiries'
        },
        {
          name: 'website',
          title: 'Official Website',
          type: 'url',
          description: 'Official government website for tax rebate information'
        }
      ]
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark as featured country',
      initialValue: false
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which countries appear (lower numbers first)',
      initialValue: 0
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'featured'
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.subtitle,
        media: selection.media ? '⭐' : '🌍'
      }
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [
        {field: 'name', direction: 'asc'}
      ]
    }
  ]
}
