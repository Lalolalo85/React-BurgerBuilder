import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
       ingredients: null,
       totalPrice: 0,
       isPurchased: false,
       didPurchase: false,
       loading: false,
       error: false
    }    
}

    componentDidMount () {
        console.log(this.props)
        axios.get('https://my-burger-builder-af261.firebaseio.com/Ingredients.json')
          .then( response => {
             this.setState({ingredients: response.data});
          })
          .catch(error => {
              this.setState({error: true})
          });
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
          .map(ing => {
              return ingredients[ing];
          })
          .reduce((sum, el) => {
              return sum + el;
          }, 0);
          this.setState({isPurchased: sum > 0});
    }
     
    addIngredientHandler = (type) => {
       const oldCount = this.state.ingredients[type];
       const updatedCount = oldCount + 1;
       const updatedIngredients = {
           ...this.state.ingredients
       };
       updatedIngredients[type] = updatedCount;
       const priceAddition = INGREDIENT_PRICES[type];
       const oldPrice = this.state.totalPrice;
       const newPrice = oldPrice + priceAddition;
       this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
       this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return null;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
          this.setState({didPurchase: true});
    }

    purchaseCancelHandler = () => {
         this.setState({didPurchase: false});
    }

    purchaseContinueHandler = () => {
      /*   this.setState({loading: true});
         const order = {
             ingredients: this.state.ingredients,
             price: this.state.totalPrice,
             customer: {
                 name: 'Luis Avila',
                 address: {
                     street: '103 Hardeman st.',
                     zipCode: '77474',
                     country: 'USA'
                 },
                 email: 'test@test.com'
             },
             deliveryMethod: 'fastest'
         }
        axios.post('/orders.json', order)
        .then( response => {
            this.setState({ loading: false, didPurchase: false });
        } )
        .catch( error => {
            this.setState({ loading: false, didPurchase: false });
        } ); */
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    };

       render () {
          const disabledInfo = {
              ...this.state.ingredients
          };
          for (let key in disabledInfo) {
              disabledInfo[key] = disabledInfo[key] <= 0
          }
        
          let orderSummary = null;
          let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

          if (this.state.ingredients) {
            burger = (
                <Aux>
                  <Burger ingredients={this.state.ingredients} />
                  <BuildControls 
                      ingredientAdded={this.addIngredientHandler}
                      ingredientRemoved={this.removeIngredientHandler} 
                      disabled={disabledInfo} 
                      isPurchased={this.state.isPurchased}
                      didPurchase={this.purchaseHandler}
                      price={this.state.totalPrice}/>
                </Aux>
            );
        orderSummary =  <OrderSummary 
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}/>;
          }
          if (this.state.loading) {
            orderSummary = <Spinner />;
        }
          

        return (
            <Aux>
                <Modal show={this.state.didPurchase} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);