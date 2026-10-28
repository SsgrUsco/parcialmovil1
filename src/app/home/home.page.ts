import { Component, OnInit, inject } from '@angular/core';
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '../models/product.model';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule,
    IonAvatar,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRow,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  private readonly inventoryService = inject(InventoryService);
  private readonly toastController = inject(ToastController);

  items: InventoryItem[] = [];
  searchTerm = '';
  selectedAlbum: number | 'Todos' = 'Todos';
  selectedItem: InventoryItem | null = null;
  restockQuantity: number | string | null = 1;
  isDetailOpen = false;
  isLoading = true;
  errorMessage = '';

  get albums(): number[] {
    return [...new Set(this.items.map((item) => item.albumId))].sort(
      (first, second) => first - second,
    );
  }

  get filteredItems(): InventoryItem[] {
    const search = this.searchTerm.trim().toLocaleLowerCase();

    return this.items.filter((item) => {
      const matchesAlbum =
        this.selectedAlbum === 'Todos' || item.albumId === this.selectedAlbum;
      const matchesSearch = item.title.toLocaleLowerCase().includes(search);

      return matchesAlbum && matchesSearch;
    });
  }

  get totalStock(): number {
    return this.items.reduce((total, item) => total + item.stock, 0);
  }

  get lowStockCount(): number {
    return this.items.filter((item) => item.stock <= 5).length;
  }

  get restockError(): string {
    if (
      this.restockQuantity === null ||
      this.restockQuantity === '' ||
      !Number.isInteger(Number(this.restockQuantity))
    ) {
      return 'Ingresa una cantidad entera para reabastecer.';
    }

    if (Number(this.restockQuantity) < 1) {
      return 'La cantidad debe ser mayor que cero.';
    }

    return '';
  }

  getStockColor(stock: number): string {
    if (stock <= 5) {
      return 'danger';
    }

    if (stock <= 12) {
      return 'warning';
    }

    return 'success';
  }

  ngOnInit(): void {
    this.inventoryService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar el inventario. Verifica tu conexión e inténtalo de nuevo.';
        this.isLoading = false;
      },
    });
  }

  openDetails(item: InventoryItem): void {
    this.selectedItem = item;
    this.restockQuantity = 1;
    this.isDetailOpen = true;
  }

  closeDetails(): void {
    this.isDetailOpen = false;
  }

  async restockSelectedItem(): Promise<void> {
    if (!this.selectedItem || this.restockError) {
      return;
    }

    const itemId = this.selectedItem.id;
    const quantity = Number(this.restockQuantity);

    this.items = this.items.map((item) =>
      item.id === itemId ? { ...item, stock: item.stock + quantity } : item,
    );
    this.selectedItem = this.items.find((item) => item.id === itemId) ?? null;
    this.closeDetails();

    const toast = await this.toastController.create({
      message: `Inventario actualizado: +${quantity} unidades`,
      duration: 2500,
      color: 'success',
      position: 'bottom',
    });

    await toast.present();
  }
}
