const logger=require('../utils/logger');
const Search=require('../models/Search');

const handleSearchPostCreated= async (event)=>{
    console.log(event,"event for created post");
    const {postId,userId,content,createdAt}=event;

    try {

        const searchPost=new Search({
            postId,userId,content,createdAt  
        })
        await searchPost.save();
   
        logger.info("Data for search post created")
      
      
      
    } catch (error) {
       logger.error("Error while creating post ")
    }



}

module.exports={handleSearchPostCreated}