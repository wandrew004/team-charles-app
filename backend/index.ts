import * as dotenv from 'dotenv';
import app from './src/app';

dotenv.config();
const port: number = parseInt(process.env.PORT || '3001');

app.listen(port, '0.0.0.0', () => {
    console.log(`App running on port ${port}.`);
});
