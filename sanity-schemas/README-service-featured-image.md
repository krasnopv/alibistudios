# Service Featured Image (featuredImageType)

The app supports three options for **Featured Image** on services:

- **None** – no featured image is shown.
- **Upload image** – use the existing `image` (asset) field.
- **Image from URL** – use an image from a URL.

## Schema fields required in Sanity

1. **featuredImageType** (you already added this):
   - type: `string`
   - options: `none` | `upload` | `url`
   - initialValue: `upload`

2. **featuredImageUrl** (add this for "Image from URL"):
   - type: `url` or `string`
   - title: e.g. "Featured Image URL"
   - description: "Used when Featured Image is set to 'Image from URL'"
   - Show/hide in Studio: only when `featuredImageType == 'url'`

3. **featuredImageAlt** (optional, for "Image from URL"):
   - type: `string`
   - title: "Featured Image Alt Text"
   - Show when `featuredImageType == 'url'`

## Example field definitions

```js
defineField({
  name: 'featuredImageType',
  title: 'Featured Image',
  type: 'string',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Upload image', value: 'upload' },
      { title: 'Image from URL', value: 'url' }
    ],
    layout: 'radio'
  },
  initialValue: 'upload'
}),
defineField({
  name: 'featuredImageUrl',
  title: 'Featured Image URL',
  type: 'url',
  description: 'Used when Featured Image is "Image from URL"',
  hidden: ({ parent }) => parent?.featuredImageType !== 'url'
}),
defineField({
  name: 'featuredImageAlt',
  title: 'Featured Image Alt Text',
  type: 'string',
  hidden: ({ parent }) => parent?.featuredImageType !== 'url'
}),
```

The front-end and API already handle these fields; add them to your Service schema in Sanity Studio.
