import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../shopping-list/shopping.service';
import { Recipe } from './recipe-model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Biryani',
  //     'A Rich Tasty Biryani',
  //     'https://vismaifood.com/storage/app/uploads/public/e12/7b7/127/thumb__1200_0_0_0_auto.jpg',
  //     [new Ingredient('Chicken', 1), new Ingredient('Rice', 5)]
  //   ),
  //   new Recipe(
  //     'Chappathi',
  //     'Delicious Chappathi Roll',
  //     'https://somethingscookingwithalpa.com/wp-content/uploads/2016/09/0058_LeftoverRoti-Quesadilla.jpg',
  //     [new Ingredient('Chappathi', 3), new Ingredient('Jam', 5)]
  //   ),
  // ];
  private recipes: Recipe[] = [];
  recipesChanged = new Subject<Recipe[]>();

  constructor(private shoppingService: ShoppingService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingService.addIngredients(ingredients);
  }
}
