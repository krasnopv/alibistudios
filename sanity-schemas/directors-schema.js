// Sanity Schema for Directors
// Copy this into your Sanity Studio schemas directory

export default {
  name: 'director',
  title: 'Director',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Director Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
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
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  }
                ]
              }
            ]
          }
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'trophies',
      title: 'Awards & Trophies',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'trophy'}]
        }
      ]
    },
    {
      name: 'works',
      title: 'Director\'s Works',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'directorWork'}]
        }
      ]
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which directors appear (lower numbers first)'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'bio'
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: subtitle ? subtitle[0]?.children[0]?.text : 'No bio'
      }
    }
  }
}

// Trophy Schema
export const trophySchema = {
  name: 'trophy',
  title: 'Trophy/Award',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Award Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: Rule => Rule.required().min(1900).max(new Date().getFullYear())
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Best Director', value: 'best-director'},
          {title: 'Outstanding Director', value: 'outstanding-director'},
          {title: 'Best Film', value: 'best-film'},
          {title: 'Best Short Film', value: 'best-short-film'},
          {title: 'Best Documentary', value: 'best-documentary'},
          {title: 'Other', value: 'other'}
        ]
      }
    },
    {
      name: 'icon',
      title: 'Trophy Icon',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'year',
      media: 'icon'
    }
  }
}

// Director Work Schema
export const directorWorkSchema = {
  name: 'directorWork',
  title: 'Director Work',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Work Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      title: 'Subtitle/Type',
      type: 'string',
      description: 'e.g., "Feature Film", "TV Series", "Short Film", "Documentary"'
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: Rule => Rule.required().min(1900).max(new Date().getFullYear())
    },
    {
      name: 'image',
      title: 'Work Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility'
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'url',
      title: 'External URL',
      type: 'url',
      description: 'Link to IMDb, official website, or trailer'
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      year: 'year',
      media: 'image'
    },
    prepare(selection) {
      const {title, subtitle, year} = selection
      return {
        title: title,
        subtitle: `${subtitle} (${year})`
      }
    }
  }
}

// Instructions for adding to Sanity Studio:
/*
1. Create these files in your Sanity Studio schemas directory:
   - director.js (main director schema)
   - trophy.js (trophy schema)
   - directorWork.js (director work schema)

2. Add the schemas to your schema.js file:
   import director from './director'
   import trophy from './trophy'
   import directorWork from './directorWork'

   export default [
     // ... your existing schemas
     director,
     trophy,
     directorWork,
   ]

3. The schemas include:
   - Director: name, bio (rich text), trophies (references), works (references), order
   - Trophy: name, year, category, icon (image)
   - Director Work: title, subtitle, year, image, description, url

4. Create content in Sanity Studio:
   - Add trophies/awards first
   - Add director works
   - Create directors and link to trophies and works
*/
