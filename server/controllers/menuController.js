const Menu = require('../models/Menu');

const for_Eachmenu = async (req,res,next)=>{
    try{
        const {restaurantid} = req.params;
        const menus = await Menu.find({restaurant: restaurantid})
            .populate('restaurant','address').populate('restaurant','description')
        res.json(menus)
                
    }
    catch(err){
        console.log(`error while fetching menu : ${err}`)
        next(err)
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
        console.error(`error while adding menu : ${err}`);
        next(err)
    }

}

const deleteMenu = async(req,res,next)=>{
    try {
        const {id} = req.params;

        const deletedMenu = await Menu.findByIdAndDelete(id);
        if(!deletedMenu) return res.status(404).send("menu not found");

        const currentMenu = await Menu.find();
        if(!currentMenu) return res.status(404).send("no menu not found");

        res.status(200).json({message:"menu deleted successfully", currentMenu})
        
    } catch (error) {
        console.log(`error while deleting menu : ${error}`);
        next(error)
    }
}

module.exports = {
    for_Eachmenu,
    for_addmenu,
    deleteMenu
}