import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe-model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private toast: HotToastService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://angular-recipe-project-udemy-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .pipe(
        this.toast.observe({
          loading: 'Saving recipes...',
          success: 'Recipes saved successfully',
          error: 'There was an error',
        })
      )
      .subscribe();
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://angular-recipe-project-udemy-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        this.toast.observe({
          loading: 'Fetching recipes...',
          success: 'Recipes fetched successfully',
          error: 'There was an error',
        }),
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
