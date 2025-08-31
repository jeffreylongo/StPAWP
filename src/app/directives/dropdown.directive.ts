import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  standalone: true
})
export class DropdownDirective {
  private dropdownMenu: HTMLElement | null = null;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.dropdownMenu = this.elementRef.nativeElement.querySelector('.dropdown-menu');
    if (this.dropdownMenu) {
      this.renderer.addClass(this.dropdownMenu, 'hidden');
    }
  }

  @HostListener('click', ['$event'])
  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.dropdownMenu) {
      const isHidden = this.dropdownMenu.classList.contains('hidden');
      
      // Close all other dropdowns first
      this.closeAllDropdowns();
      
      if (isHidden) {
        this.renderer.removeClass(this.dropdownMenu, 'hidden');
        this.renderer.addClass(this.dropdownMenu, 'block');
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  private closeDropdown() {
    if (this.dropdownMenu) {
      this.renderer.addClass(this.dropdownMenu, 'hidden');
      this.renderer.removeClass(this.dropdownMenu, 'block');
    }
  }

  private closeAllDropdowns() {
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    allDropdowns.forEach(dropdown => {
      this.renderer.addClass(dropdown, 'hidden');
      this.renderer.removeClass(dropdown, 'block');
    });
  }
}
