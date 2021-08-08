

module.exports= (db,type)=>{
    return db.define('user',{
        name:type.STRING,
        email:{
            unique:true,
            type:type.STRING
        },
        phone:{
            type:type.STRING,
            unique:true 
        },
        password:type.STRING,
        verified:{
            defaultValue:false,
            type:type.BOOLEAN
        },
        verify_code: type.STRING

    })
}