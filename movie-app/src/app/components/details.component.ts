import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { Item } from '../models/response';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  item: Item | undefined;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'מזהה שגוי';
      return;
    }

    this.dataService.getItemById(id).subscribe(item => {
      if (item) {
        this.item = item;
      } else {
        this.error = 'פריט לא נמצא';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
