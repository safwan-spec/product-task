import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, AppBar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
    });
    const [products, setProducts] = useState([]); 
    const [editingProductId, setEditingProductId] = useState(null);
    
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

   
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data); 
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    
    useEffect(() => {
        fetchProducts();
    }, []);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProductId) {
               
                const response = await axios.put(`http://localhost:5000/api/products/${editingProductId}`, product);
                console.log('Product updated:', response.data);
                alert("Product updated");
            } else {
              
                const response = await axios.post('http://localhost:5000/api/products', product);
                console.log('Product saved:', response.data);
                alert("Product saved");
            }
            setProduct({ name: '', category: '', quantity: 0, price: 0 });
            setEditingProductId(null); 
            fetchProducts(); 
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    
    const handleEdit = (product) => {
        setProduct(product); 
        setEditingProductId(product._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            alert("Product deleted");
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ width: "800px", ml: "300px" }}>
                <Typography sx={{ fontStyle: 'inherit', fontWeight: "bold" }}>
                    {editingProductId ? 'Edit Product Details' : 'Enter Product Details'}
                </Typography>
                <TextField 
                    name="name" 
                    label="Name" 
                    variant="outlined" 
                    fullWidth
                    value={product.name} 
                    onChange={handleChange} 
                    required 
                    sx={{ mb: 2, backgroundColor: 'white' }} 
                />
                <TextField 
                    name="category" 
                    label="Category" 
                    variant="outlined" 
                    fullWidth 
                    value={product.category} 
                    onChange={handleChange} 
                    required 
                    sx={{ mb: 2, backgroundColor: 'white' }} 
                />
                <TextField 
                    name="quantity" 
                    label="Quantity" 
                    type="number" 
                    variant="outlined" 
                    fullWidth 
                    value={product.quantity} 
                    onChange={handleChange} 
                    required 
                    sx={{ mb: 2, backgroundColor: 'white' }} 
                />
                <TextField 
                    name="price" 
                    label="Price" 
                    type="number" 
                    variant="outlined" 
                    fullWidth 
                    value={product.price} 
                    onChange={handleChange} 
                    required 
                    sx={{ mb: 2, backgroundColor: 'white' }} 
                />
                <Button type="submit" variant="contained" color={editingProductId ? "primary" : "error"}>
                    {editingProductId ? 'Update Product' : 'Add Product'}
                </Button>
            </Box>

          
            <Box sx={{ mt: 4 }}>
            <AppBar position="static" color='primary'>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: "bold", margin: "15px" }}>
                    Stored Products
                </Typography>
            </AppBar>
            {products.length > 0 ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography sx={{ fontWeight: "bold" }}>Name</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: "bold" }}>Category</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: "bold" }}>Quantity</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: "bold" }}>Price</Typography></TableCell>
                            <TableCell><Typography sx={{ fontWeight: "bold" }}>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((prod) => (
                            <TableRow key={prod._id}>
                                <TableCell>{prod.name}</TableCell>
                                <TableCell>{prod.category}</TableCell>
                                <TableCell>{prod.quantity}</TableCell>
                                <TableCell>₹{prod.price}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(prod)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(prod._id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <Typography>No products available.</Typography>
            )}
            </Box>
        </Box>
    );
};

export default ProductForm;
