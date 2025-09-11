import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ROUTES
router.get("/total-stock-value", getStockValue)
router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);



//CREATE
async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({ message:"Products created: ", data: product })
	} catch (error) {
		res.status(500).json({ error });
	}
};

//GET ALL
async function getAllProducts(req, res) {
	try {
    /* TODO: ska man fixa filter med regexp här? */
	const products = await Product.find();

    res.status(200).json({ message: "All products: ", data: products })
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch products: ", error })
	}
}

//GET BY ID
async function getProduct(req, res) {
	try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product could not be found." });

    res.status(200).json({ message: "Successfully retrieved product.", data: product });
	} catch (error) {
		res.status(500).json({ message: "Failed to retrieve product.", error })
	}
}

//UPDATE BY ID
async function updateProduct(req, res) {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!product) return res.status(404).json({ error: "Could not find product." });

    res.status(200).json({ message: "Successfully updated product.", data: product });
	} catch (error) {
		res.status(500).json({ error })
	}
}

//DELETE BY ID
async function deleteProduct(req, res) {
	try {
		const deleteProductById = await Product.findByIdAndDelete(req.params.id);

    if(!deleteProductById) {
      return res.status(404).json({error: "Contact not found"});
    }
    res.status(200).json({message: "Deleted product by ID", data: deleteProductById })
	} catch (error) {
		res.status(500).json({ message: "Internal server error. Failed to delete product by ID.", error })
	}
}

async function getStockValue(req, res) {
	try{
    const allProducts = await Product.aggregate([
			{
				$project: {
					stockValue: {
						$multiply: ["$price", "$amountInStock"]
					}
				}
			},
			{
				$group: {
					_id: null,
					totalStockValue: { $sum: "$stockValue" }
				}
			}
		]);
		res.status(200).json({data: { totalStock: allProducts[0]?.totalStockValue || 0 }})
		} catch (error) {
			res.status(500).json({ message: "Internal server error. Failed to retrieve total stock value.", error })
		}
}

export default router;