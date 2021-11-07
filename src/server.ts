import {createServer} from 'http';

createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.end('Home Page');
        return;
    } else if (req.url === '/add-user' && req.method === 'POST') {
        const chunkArray: any = [];
        req.on('data', (chunk) => {
            chunkArray.push(...chunk);
        });
        req.on('end', () => {
            const data = Buffer.from(chunkArray).toString();
            res.end(data);
            return;
        });
        req.on('error', () => {
            res.end('Error reading request data');
            return;
        })
    } else {
        res.end('Unhandled Path');
    }
}).listen(3000, () => console.log('Server is running...'))
