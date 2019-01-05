import axios from '../../axios-orders';

import * as actionTypes from './actionTypes';

export const addIngredient = (name) => {
 return {
     type: actionTypes.ADD_INGREDIENT,
     ingredientName: name
 };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
   };

   export const setIngredients = (ingredients) => {
      return {
          type: actionTypes.SET_INGREDIENTS,
          ingredients: ingredients
      }
   };

   export const fetchIngredientsFailed = () => {
      return {
          type: actionTypes.FETCH_INGREDIENTS_FAILED
      };
   };

   export const initIngedients = () => {
     return dispatch => {
        axios.get('https://my-burger-builder-af261.firebaseio.com/Ingredients.json')
        .then( response => {
          dispatch(setIngredients(response.data))
        })
        .catch(error => {
           dispatch(fetchIngredientsFailed());
        });
     };
   };