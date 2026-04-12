import Fastify from "fastify";
import cors from '@fastify/cors'
import fs from 'fs/promises';
import "dotenv/config"
const fastify = Fastify({logger:true})

//cors
await fastify.register(cors, { 
    origin: "*", // Permite que cualquier frontend se conecte
    methods: ["POST", "GET", "OPTIONS"], // Permite explícitamente OPTIONS
    allowedHeaders: ['Content-Type'] // Permite que enviemos JSON
});




//Method post to  validate transfer of fintech app frontend and drupal
fastify.post('/process-transfer', async (request, reply) => {
    console.log("Datos recibidos del Frontend:", request.body);
    const { amount, destination } = request.body;

    // 1. not null validation 
    if (!amount || amount <= 0) {
        return reply.status(400).send({ 
            success: false, 
            message: "Invalid amount, it can be less than cero" });
    }

    // 2. security limit
    const SECURITY_LIMIT = 4000;
    if (amount > SECURITY_LIMIT) {
        return reply.status(403).send({ 
            success: false, 
            message: "Amount exceeds security limits" 
        });
    }
    const logEntry = `[${new Date().toISOString()}] Transfer: $${amount} to ${destination}\n`;
    try {
        await fs.appendFile('transactions.log', logEntry);
    } catch (err) {
        fastify.log.error("Error escribiendo log:", err);
    }

    // 3. sucess
    return {
        success: true,
        transactionId: `BANK-${Date.now()}`,
        processedAt: new Date().toISOString(),
    };



});

//running the server
fastify.get('/', async function handlerMethod (request, reply) {
    return {
        mesage:"Microservicios de Pagos NodeJs",
        status:"ok"
    }
})

try{
    await fastify.listen({port:1080})
    console.log("server running smoothly")
}catch{
    fastify.log.error(err)
    console.error("server didnt log out")
    process.exit(1)   
}