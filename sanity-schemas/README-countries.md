# Countries Schema for Sanity.io

This schema provides two options for managing country content in a Sanity project.

## Schema Options

### 1. Advanced Schema (`countriesSchema`)
- **Best for**: Complex content with rich text formatting
- **Features**: 
  - Rich text blocks with formatting options
  - Structured section types
  - Flexible content management
  - SEO fields

### 2. Simple Schema (`countriesSimpleSchema`)
- **Best for**: Quick setup and simple content
- **Features**:
  - Simple string arrays for lists
  - Basic text fields
  - Easier to manage
  - Faster to implement

## Usage in Sanity Project

### Installation
1. Copy the schema file to your Sanity project
2. Import and add to your schema configuration:

```javascript
// In your sanity.config.js or schema/index.js
import { countriesSchema, countriesSimpleSchema } from './schemas/countries-schema.js';

export default {
  // ... other config
  schema: {
    types: [
      // ... other schemas
      countriesSchema, // or countriesSimpleSchema
    ]
  }
}
```

### Content Structure

#### Advanced Schema Structure
```javascript
{
  title: "France",
  slug: "fr",
  code: "FR",
  intro: {
    title: "France Tax Rebate Information",
    description: [/* rich text blocks */]
  },
  sections: [
    {
      _type: "eligibleExpenses",
      title: "Eligible expenses include:",
      points: [
        { point: "VFX work", description: "Visual effects work" },
        { point: "Post-production", description: "Post-production services" }
      ]
    },
    {
      _type: "qualifyingRequirements", 
      title: "Qualifying requirements",
      points: [
        { requirement: "Minimum spend", description: "€2M minimum" }
      ]
    }
  ]
}
```

#### Simple Schema Structure
```javascript
{
  title: "France",
  slug: "fr", 
  code: "FR",
  introTitle: "France Tax Rebate Information",
  introDescription: "Detailed description...",
  eligibleExpensesTitle: "Eligible expenses include:",
  eligibleExpenses: ["VFX work", "Post-production", "Animation"],
  qualifyingRequirementsTitle: "Qualifying requirements", 
  qualifyingRequirements: ["Minimum spend €2M", "French company involvement"],
  howToApplyTitle: "How to apply?",
  howToApply: ["Step 1: Prepare documents", "Step 2: Submit application"],
  customSections: [
    { title: "Additional Info", content: "Custom content here" }
  ]
}
```

## API Integration

### GROQ Query for Advanced Schema
```groq
*[_type == "countries"] {
  _id,
  title,
  slug,
  code,
  intro,
  sections[] {
    _type,
    title,
    points[] {
      point,
      description
    },
    steps[] {
      step,
      description  
    },
    content
  }
}
```

### GROQ Query for Simple Schema
```groq
*[_type == "countriesSimple"] {
  _id,
  title,
  slug,
  code,
  introTitle,
  introDescription,
  eligibleExpensesTitle,
  eligibleExpenses,
  qualifyingRequirementsTitle,
  qualifyingRequirements,
  howToApplyTitle,
  howToApply,
  customSections[] {
    title,
    content
  }
}
```

## Section Types

### 1. Introduction Section
- **Purpose**: Main country overview
- **Fields**: Title, Description (rich text)

### 2. Eligible Expenses Section  
- **Purpose**: List of qualifying expenses
- **Fields**: Title, List of points with descriptions

### 3. Qualifying Requirements Section
- **Purpose**: Requirements to qualify
- **Fields**: Title, List of requirements with descriptions

### 4. How to Apply Section
- **Purpose**: Application process steps
- **Fields**: Title, List of steps with descriptions

### 5. Custom Content Section
- **Purpose**: Flexible content for any additional information
- **Fields**: Title, Rich text content

## Frontend Integration

The content can be fetched via API and rendered dynamically:

```javascript
// Fetch countries data
const response = await fetch('/api/countries');
const countries = await response.json();

// Render sections based on type
countries.forEach(country => {
  country.sections.forEach(section => {
    switch(section._type) {
      case 'eligibleExpenses':
        // Render as bulleted list
        break;
      case 'qualifyingRequirements':
        // Render as numbered list
        break;
      case 'howToApply':
        // Render as step-by-step process
        break;
      case 'customSection':
        // Render as rich text content
        break;
    }
  });
});
```

## Benefits

- **Flexible**: Support for different content types
- **Structured**: Consistent data format
- **Scalable**: Easy to add new countries
- **Maintainable**: Clear content organization
- **SEO Ready**: Built-in SEO fields
