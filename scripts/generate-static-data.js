const { client, queries } = require('../src/lib/sanity');
const fs = require('fs');
const path = require('path');

async function generateStaticData() {
  try {
    console.log('Generating static data files...');
    
    // Create public/api directory
    const apiDir = path.join(__dirname, '../public/api');
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }

    // Fetch all data
    const [films, categories, awards, services, addresses] = await Promise.all([
      client.fetch(queries.films),
      client.fetch(queries.categoriesWithFilms),
      client.fetch(queries.awards),
      client.fetch(queries.services),
      client.fetch(queries.addresses)
    ]);

    // Write static JSON files
    fs.writeFileSync(path.join(apiDir, 'films.json'), JSON.stringify(films));
    fs.writeFileSync(path.join(apiDir, 'categories.json'), JSON.stringify(categories));
    fs.writeFileSync(path.join(apiDir, 'awards.json'), JSON.stringify(awards));
    fs.writeFileSync(path.join(apiDir, 'services.json'), JSON.stringify(services));
    fs.writeFileSync(path.join(apiDir, 'addresses.json'), JSON.stringify(addresses));

    console.log('✅ Static data files generated successfully!');
    console.log('Generated files:');
    console.log('- /api/films.json');
    console.log('- /api/categories.json');
    console.log('- /api/awards.json');
    console.log('- /api/services.json');
    console.log('- /api/addresses.json');
  } catch (error) {
    console.error('❌ Error generating static data:', error);
    process.exit(1);
  }
}

generateStaticData();
