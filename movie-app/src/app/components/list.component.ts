// מייבאים כל מיני דברים שצריך
import { Component, OnInit } from '@angular/core'; 
import { DataService } from '../services/data.service'; 
import { Item } from '../models/response'; 
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-item-list', 
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './list.component.html', 
  styleUrls: ['./list.component.scss'] 
})
export class ListComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = []; 
  types: { name: string; count: number }[] = [];

  searchTerm: string = '';
  selectedType: string = 'all';
  sortAsc: boolean = true;
  viewMode: 'list' | 'grid' = 'list';

  editingId: string | null = null;
  originalTitle: string = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.fetchAndStoreItems();

    this.dataService.items$.subscribe(items => {
      this.items = items;
      this.refreshTypes(); 
      this.applyFilters();
    });
  }

  applyFilters() {
    let filtered = [...this.items]; //CTRL+V

    if (this.selectedType !== 'all') {
      filtered = filtered.filter(item => item.Type === this.selectedType);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.Title.toLowerCase().includes(term) || item.Year.includes(term)
      );
    }

    filtered.sort((a, b) => this.sortAsc
      ? a.Title.localeCompare(b.Title)
      : b.Title.localeCompare(a.Title)
    );

    this.filteredItems = filtered;
  }

  refreshTypes() {
    const typeMap: Record<string, number> = {};
    this.items.forEach(item => {
      typeMap[item.Type] = (typeMap[item.Type] || 0) + 1;
    });

    this.types = Object.entries(typeMap).map(([name, count]) => ({ name, count }));
  }

  onSearch(value: string) {
    this.searchTerm = value;
    this.applyFilters();
  }

  onSelectType(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  onSortToggle() {
    this.sortAsc = !this.sortAsc;
    this.applyFilters();
  }

  onToggleView() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  onClear() {
    this.searchTerm = '';
    this.selectedType = 'all';
    this.sortAsc = true;
    this.applyFilters();
  }

  onRefresh() {
    this.onClear();
    this.dataService.fetchAndStoreItems();
  }

  editItem(item: Item) {
    this.editingId = item.imdbID;
    this.originalTitle = item.Title;
  }

  onTitleBlur(item: Item, newTitle: string) {
    this.editingId = null;
    const trimmed = newTitle.trim();

    if (trimmed && trimmed !== this.originalTitle) {
      const updatedItem = { ...item, Title: trimmed };

      this.dataService.updateItem(updatedItem).subscribe(() => {
        const idx = this.items.findIndex(i => i.imdbID === item.imdbID);
        if (idx !== -1) {
          this.items[idx] = updatedItem;
          this.applyFilters();
        }
      });
    }
  }

  goToDetails(id: string) {
    this.router.navigate(['/item', id]);
  }
}
