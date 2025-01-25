const {ApolloServer} =require('@apollo/server');
const {startStandaloneServer}=require('@apollo/server/standalone');
require('dotenv').config();
const connecttoDB= require("./db/connectdb");

const typeDefs=require('./graphql/schema');
const resolvers=require('./graphql/resolvers');


async function startServer() {
    await connecttoDB();
    const server =new ApolloServer({
        typeDefs,
        resolvers,
    })
   const {url}=await startStandaloneServer(server,{
    listen:{port:process.env.PORT}
   }) ;

   console.log(url);
   
};

startServer();
