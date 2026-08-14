import fs from 'fs';
let code = fs.readFileSync('src/initialData.ts', 'utf8');

const regex = /\{\n\s*id: 'read-4',[\s\S]*?\},/;
const replacement = `{
    id: 'read-4',
    title: 'How-Countries-Go-Broke',
    category: 'Books',
    source: 'Ray Dalio',
    content: \`Essential VARC preparation book summary...\`,
    date: 'Today',
    readTimeMinutes: 45,
    isBookmarked: false,
    isRead: false,
    imageUrl: 'https://m.media-amazon.com/images/I/41-q1D1qWNL.jpg' // Approximate cover image of "How Countries Go Broke" or similar
  },`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/initialData.ts', code);
  console.log('updated initialData.ts reading items');
}
