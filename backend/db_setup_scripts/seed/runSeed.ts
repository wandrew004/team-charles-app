import { seedDatabase } from './seedDatabase';

console.log('Starting database seeding process...');
seedDatabase()
    .then(() => {
        console.log('Seeding completed successfully!');
        process.exit(0);
    })
    .catch((error: Error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    }); 