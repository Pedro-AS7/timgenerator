// backend/src/index.ts
import express from 'express'
import cors from 'cors'
import { sql } from './db_client.js'; 
import path from 'path';

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(
	cors({
		origin: 'http://localhost:5173', // Substitua pela URL do seu frontend Vite
	})
)

const clientBuildPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));

app.post('/api/report', async (req, res) => {
	const result = req.body
    const data = result

    console.log(data)

    try {
        const report = await sql`INSERT INTO public.reports (rtitle, rdescription, user_email) values (${data.title}, ${data.description}, ${data.email ? data.email : 'no email'})`
        console.log('Report done: ' + data)
    } catch(error) {
        console.log('Error to insert error into db: ' + error)
    }
    


	
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
});



app.listen(PORT, () => {
	console.log(`Backend rodando em http://localhost:${PORT}`)
})
