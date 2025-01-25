// const products = require("../data/product");

// const resolvers = {
//   Query: {
//     products: () => products,
//     product: (_, { id }) => products.find((item) => item.id === id),
//   },
//   Mutation: {
//     createProduct: (_, { title, category, price, inStock }) => {
//       const newProd = {
//         id: String(products.length + 1),
//         title,
//         category,
//         price,
//         inStock,
//       };
//       products.push(newProd);
//       return newProd;
//     },
//     deleteProduct:(_,{id})=>{
//       const index=  products.findIndex(item=>item.id===id);
//       if(index ===-1) 
//         return false;

//       products.splice(index,1)
//       return true
//     },
//     updateProduct:(_,{id,...updates})=>{
//         const index=  products.findIndex(item=>item.id===id);
//         if(index ===-1) 
//           return null;
  
//         products[index]={...products[index],...updates}
//         return  products[index]
//     }
//   },
// };

// module.exports = resolvers;




const Product = require("../models/product");

const resolvers = {
  Query: {
    products: async() => await Product.find({}),
    product: async(_, { id }) => await Product.findById(id),
  },
  Mutation: {
    createProduct: async (_,agrs) => {
        
    const result = await Product.create(agrs)
 
      return result;
    },
    deleteProduct:async(_,{id})=>{
      const result= await Product.findByIdAndDelete(id);
      return !!result
    
    },
    updateProduct:async(_,{id,...updates})=>{
        const index=  await Product.findByIdAndUpdate(id,updates,{new:true});
      return index
    }
  },
};

module.exports = resolvers;

