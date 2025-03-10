import React, { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { ECOMMERCE_ROUTES } from '../constants/routes';

interface AddressFormValues {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const CheckoutPage = () => {
  const [addressFormValues, setAddressFormValues] = useState<AddressFormValues>({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const { addOrder } = useOrder();
  const navigate = useNavigate();
  const { clearCart, total } = useCart();

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressFormValues({
      ...addressFormValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addOrder(addressFormValues);
    clearCart();
    navigate(ECOMMERCE_ROUTES.ROOT);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Address Form */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Shipping Information</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={addressFormValues.firstName}
                  onChange={handleAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={addressFormValues.lastName}
                  onChange={handleAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Street Address"
                  name="streetAddress"
                  value={addressFormValues.streetAddress}
                  onChange={handleAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="City"
                  name="city"
                  value={addressFormValues.city}
                  onChange={handleAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="State"
                  name="state"
                  value={addressFormValues.state}
                  onChange={handleAddressChange}
                  margin="normal"
                  required
                />
                <TextField
                  label="Zip Code"
                  name="zipCode"
                  value={addressFormValues.zipCode}
                  onChange={handleAddressChange}
                  margin="normal"
                  required
                />
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Order Summary</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Subtotal" />
                  <Typography>${total.toFixed(2)}</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Shipping" />
                  <Typography>Free</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Total" />
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </ListItem>
              </List>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
                Place Order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
