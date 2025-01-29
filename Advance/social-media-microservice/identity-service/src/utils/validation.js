const Joi =require('joi');

const validateRegester=(data)=>{

    const schema = Joi.object({
        userName:Joi.string().min(3).max(50).require(),
        email:Joi.string().email().require(),
        password:Joi.string().min(6).require()

    });

    return schema.validate(data);
}

module.exports={validateRegester}