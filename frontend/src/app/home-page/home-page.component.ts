
import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  isMenuOpen = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.setupScrollEvents();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const navbar = document.querySelector('[data-navbar]');
    const overlay = document.querySelector('[data-overlay]');
    
    if (this.isMenuOpen) {
      navbar?.classList.add('active');
      overlay?.classList.add('active');
    } else {
      navbar?.classList.remove('active');
      overlay?.classList.remove('active');
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    const navbar = document.querySelector('[data-navbar]');
    const overlay = document.querySelector('[data-overlay]');
    navbar?.classList.remove('active');
    overlay?.classList.remove('active');
  }

  private setupScrollEvents() {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('[data-header]');
      if (window.scrollY > 100) {
        header?.classList.add('active');
      } else {
        header?.classList.remove('active');
      }
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    this.closeMenu();
  }
}








