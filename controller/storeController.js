
import  {storeModel}  from "../models/Store.js";


export const addStoreProduct=async (req,res)=>{
  try {
    const id = req.params.id;
    const product={
      name:req.body.name,
      storeName:req.body.storeName,
      countInStock:req.body.countInStock,
      image:req.body.image,
      price:req.body.price,
      rating:req.body.rating,
      isFeatured:req.body.isFeatured,
      description:req.body.description,
      barcode:req.body.barcode,
      status:req.body.status,
    } 

    // Check if the store with the given ID exists
    const store = await storeModel.findOne({_id:id});

    if (!store) {
      return res.status(404).json({ error: "Store not found." });
    }

    // Check for required fields
    if (  !product.name || !product.storeName || !product.countInStock || !product.image || !product.price || !product.description || !product.barcode || !product.status) {
      // return res.status(400).json({ error: "Required fields are missing." });
      return res.status(400).json(product);
    }
    
   
    store.products = Array.isArray(store.products) ? store.products : [];
    // Add the new product to the store's products array
     store.products = [...store.products, product];
     
    // Save the updated store with the new product
     const updatedStore = await store.save();
    // Respond with the updated store data
    return res.status(200).json(updatedStore);
  } catch (error) {
    // Handle error
    console.error("Error adding product to store:", error);
    return res.status(500).send("Internal Server Error");
  }

}


export const AddStore = async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.name || !req.body.store_email || !req.body.deliveryTime) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    // Create the store data
    

    // Create a new store instance
    const newStore = new storeModel({
      name: req.body.name,
      store_email: req.body.store_email,
      deliveryTime: req.body.deliveryTime,
      description: req.body.description || null,
      avatar: req.body.avatar || null,
      revenue: req.body.revenue || 0,
      sales: req.body.sales || 0,
      products: null,
      id:req.body.id,
    });

    // Save the new store to the database
    const savedStore = await newStore.save();

    // Respond with the saved store data
    res.status(201).json(savedStore);
  } catch (error) {
    // Handle error
    console.error("Error adding store:", error);
    res.status(500).send("Internal Server Error");
  }
};


//gets the list of all the available stores in the mongodb
export const getStores = async (req, res) => {
  try {
    const stores = await storeModel.find();

    if (stores.length === 0) {
      return res.status(404).json({ message: "No stores found" });
    }

    res.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getSpecificStore = async (req, res) => {//returns the specific store according to the custom id provided. Not the MongoDb id
  try {

    const stores = await storeModel.findOne({_id:req.params.id});

    if (stores.length===0) {
      return res.status(404).json({ message: "Store Does not Exist" });
    }

    res.json(stores);
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getStoreProducts = async (req, res) => {//returns the store products in the db
  try {
    const stores = await storeModel.findOne({_id:req.params.id});

    if (!stores) {
      return res.status(404).json({ message: "Store Does not Exist" });
    }
    return res.json(stores.products);
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//returns a specific product in a store
export const getSpecificStoreProduct=async (req,res)=>{
  try {
    const storeId=req.params.storeId;
    const productId=req.params.productId;
    // Find the store by ID
    const store = await storeModel.findById(storeId);

    // Check if the store exists
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Find the product within the store by product ID
    const product = store.products.find((p) => p._id.toString() === productId);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found in the store" });
    }

    // Return the specific product details
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//deletes the store from the db as the _id is recieved by params
export const deleteStore = async (req, res) => {
  try {
    const id = req.params.storeId;

    // Check if the store exists
    const existingStore = await storeModel.findById(id);
    if (!existingStore) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // If the store exists, proceed with deletion
    const deletedStore = await storeModel.findByIdAndDelete(id);

    if (!deletedStore) {
      return res.status(500).json({ error: 'Failed to delete store' });
    }

    return res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const productId = req.params.productId;

    // Check if the store exists
    const existingStore = await storeModel.findById(storeId);
    if (!existingStore) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if the product exists within the store
    const existingProductIndex = existingStore.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // If the product exists, remove it from the array
    existingStore.products.splice(existingProductIndex, 1);

    // Save the updated store
    await existingStore.save();

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};