import Fastify from "fastify";
import "dotenv/config"
const fastify = Fastify({logger:true})

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