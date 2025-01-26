const Menu = require('../models/Menu');

const for_Eachmenu = async (req,res)=>{
    try{
        const {restaurantid} = req.params;
        const menus = await Menu.find({restaurant: restaurantid})
            .populate('restaurant','address').populate('restaurant','description')
        res.json(menus)
                
    }
    catch(err){
        console.log(err)
    }
}

const for_addmenu = async (req,res)=>{
    try{
        const {name,price,food_description,restaurant } = req.body;
        const image = req.file ? req.file.path : null;

        const newMenu = new Menu({
            name,
            price,
            food_description,
            restaurant ,
            image
        })

        await newMenu.save();
        res.status(201).json({ message: 'Restaurant added successfully!', Menu: newMenu }); // Success response
    }catch(err){
        console.error(err);
    }

}



module.exports = {
    for_Eachmenu,
    for_addmenu,

}