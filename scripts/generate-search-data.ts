import { fetchIPOMetadata } from '@/lib/api';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateIPOMetadata() {
    try {
        console.log('Fetching IPO metadata...');
        const response = await fetchIPOMetadata();

        if (!response.data) {
            console.error('No data received from API');
            return;
        }

        const metadata = response.data.map(ipo => ({
            slug: ipo.slug,
            name: ipo.name,
        }));

        // Write to public directory
        const outputPath = join(process.cwd(), 'public', 'ipo-metadata.json');
        writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

        console.log(`✓ Generated IPO metadata: ${metadata.length} IPOs`);
        console.log(`✓ Saved to: ${outputPath}`);
    } catch (error) {
        console.error('Error generating IPO metadata:', error);
        process.exit(1);
    }
}

generateIPOMetadata();
