import {createServer} from 'http';

createServer(async (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        return res.end('Home Page');
    } else if (req.url === '/add-user' && req.method === 'POST') {
        const chunkArray: any = [];
        for await (const chunk of req) {
            chunkArray.push(...chunk);
        }
        const data = Buffer.from(chunkArray).toString();

        return res.end(data);
    } else {
        res.end('Unhandled Path');
    }
}).listen(3000, () => console.log('Server is running...'))
