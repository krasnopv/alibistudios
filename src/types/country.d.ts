export interface Country {
  _id: string;
  name: string;
  code: string;
  slug: {
    current: string;
  };
  description?: string;
  sections: CountrySection[];
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  featured: boolean;
  order: number;
}

export interface CountrySection {
  _type: 'introSection' | 'eligibleExpensesSection' | 'qualifyingRequirementsSection' | 'howToApplySection' | 'customContentSection';
  title: string;
  description?: string;
  points?: CountrySectionPoint[];
  content?: any[]; // Portable Text content
}

export interface CountrySectionPoint {
  point?: string;
  requirement?: string;
  step?: string;
  expense?: string;
  description?: string;
}

export interface CountriesResponse {
  countries: Country[];
}

export interface CountryResponse {
  country: Country;
}
