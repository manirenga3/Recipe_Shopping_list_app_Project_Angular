import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
    });
  }

  onAddToShoppingList() {
    this.toast.loading('Adding to shopping list...', { duration: 1000 });
    setTimeout(() => {
      this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
      this.toast.success('Added to shopping list successfully');
    }, 1000);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.toast.loading('Deleting recipe...', { duration: 1000 });
    setTimeout(() => {
      this.recipeService.deleteRecipe(this.id);
      this.router.navigate(['/recipes']);
      this.toast.success('Recipe deleted successfully');
    }, 1000);
  }
}
