const Restaurant = require('../models/Restaurant');

const foradding = async (req,res,next)=>{
    try {
        let { name, address, food_types, opening_time, closing_time, description, rating } = req.body;
        const image = req.file ? req.file.path : null;
        if(!image) return res.status(404).send("File not found")

        if (typeof food_types === 'string') {
            food_types = JSON.parse(food_types);
        }
        const newRestaurant = new Restaurant({
            name,
            address,
            food_types,
            opening_time,
            closing_time,
            description,
            rating,
            image

        });

        await newRestaurant.save(); 
        res.status(201).json({ message: 'Restaurant added successfully!', restaurant: newRestaurant }); // Success response
    } catch (err) {
        console.error(`Error while adding restaurant : ${err}`);
        next(err)
    }
}

const restaurantFilter = async (req,res,next)=>{
    try {
        const { foodtype, search } = req.query;
        // console.log(req.query)
        let query = {};
        
        if (foodtype) {
            const foodTypesArray = foodtype.split(',');
            query.food_types = { $in: foodTypesArray };
        }

        if (search) {
            query.$or = [ // This allows searching by name or description
                { name: { $regex: search, $options: 'i' } }, // 'i' makes it case-insensitive
                { food_types: { $regex: search, $options: 'i' } }
            ];
        }
        
        const restaurants = await Restaurant.find(query);
        if(!restaurants) return res.status(404).json({message:"No restaurants found"})
        res.status(200).json(restaurants);

        // Restaurant.find()
        //     .then(response=>res.json(response))
        //     .catch(err=>console.log(err))
    } catch (error) {
        console.error(`Error while filtering : ${err}`);
        next(err)
    }
}

const for_allrestaurant = async(req,res,next)=>{
    try {
        let restaurants = await Restaurant.find()
        if(!restaurants) return res.status(404).json({message:"No restaurant found"})

        res.status(200).json(restaurants)
    } catch (error) {
        console.error(`Error while fetching restaurants : ${err}`);
        next(error)
    }
 
}

const for_fewrestaurants = async (req, res, next) => {
    try {
      // Limit the number of restaurants to 10
      const restaurants = await Restaurant.find().sort({ createdAt: -1 }).limit(6);
      if(!restaurants) return res.status(404).send({message:"no restaurants found"})

      res.status(200).json(restaurants);
    } catch (error) {
        console.log(`error while fetching restaurants : ${error}`)
        next(error)
    }
}

const for_foodtypes =  async (req, res,next) => {
    try {
        const foodTypes = await Restaurant.distinct('food_types');// This is mongoDB distinct which allows you to get the unique values for a specific field across all documents in your collection.
        if(!foodTypes) return res.status(404).json({message:"No food type found"})
        res.status(200).json(foodTypes);
    }
     catch (err) {
        console.error(`Error while fetching foodTypes : ${err}`);
        next(err)
    }
}

const getone = async (req, res,next) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        console.log(`Error while fetching restaurant: ${error}`);
        next(error)
    }
};

const updateone = async (req, res,next) => {
    try {
      const { id } = req.params;
      const updatedData = {
        ...req.body,
        image: req.file ? `/images/${req.file.filename}` : req.body.image, // Use the new image if provided
      };
  
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updatedData, { new: true });
      if(!updatedRestaurant) return res.status(404).json({message:"Restaurant not found"})

      const currentRestaurants = await Restaurant.find()
      
      if (!updatedRestaurant) return res.status(404).send('Restaurant not found');
  
      res.json({message:"Restaurant updated successfully!",data:currentRestaurants});
    } catch (error) {
        console.log(`Error while updating restaurant : ${error}`)
        next(error)
    }
}

const deleteone = async (req,res,next)=>{
    try {
        let {id} = req.params;

        const deletedRestaurants = Restaurant.findByIdAndDelete(id)
        if(!deletedRestaurants) return res.status(404).json({message:"Restaurant not found"})

        const currentRestaurants = await Restaurant.find()
      
        if (!currentRestaurants) return res.status(404).send('Restaurant not found');

        res.json({message:"Restaurant deleted successfully!",data:currentRestaurants});
            
    } catch (error) {
        console.log(`Error while deleting restaurant : ${error}`);
        next(error)
    }
}

module.exports = {
    foradding,
    restaurantFilter,
    for_allrestaurant,
    for_fewrestaurants,
    for_foodtypes,
    deleteone,
    updateone,
    getone
}