import { gsap } from 'gsap';
import Swiper from 'swiper';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import { TimelineConfig, TimelinePeriod, CirclePoint } from '../types/timeline.types';

export default class Timeline {
  private container: HTMLElement;
  private config: TimelineConfig;
  private currentPeriodIndex: number;
  private circlePoints: CirclePoint[] = [];
  private swiper: Swiper | null = null;
  private isAnimating: boolean = false;
  private currentRotation: number = 0; 

  constructor(container: HTMLElement, config: Partial<TimelineConfig>) {
    this.container = container;
    this.config = {
      periods: [],
      initialPeriod: 0,
      circleRadius: 265,
      animationDuration: 0.8,
      enableKeyboardNavigation: true,
      swiperConfig: {},
      ...config
    };
    
    this.currentPeriodIndex = this.config.initialPeriod || 0;
    
    this.init();
  }

  private init(): void {
    this.validateConfig();
    this.createMarkup();
    this.calculateCirclePoints();
    this.initializeSwiper();
    this.setupEventListeners();
    this.setInitialState();
  }

  private validateConfig(): void {
    if (!this.config.periods?.length) {
      throw new Error('Timeline: periods array is required');
    }
    
    if (this.config.periods.length < 2 || this.config.periods.length > 6) {
      throw new Error('Timeline: periods count should be between 2 and 6');
    }

    if (this.currentPeriodIndex >= this.config.periods.length) {
      this.currentPeriodIndex = 0;
    }
  }

  private createMarkup(): void {
    const timelineHTML = `
      <div class="timeline">
        <div class="timeline__container">
          <div class="timeline__header">
            <h2 class="timeline__title">Исторические<br>даты</h2>
          </div>
          
          <div class="timeline__main-content">
            <div class="timeline__category-label">
              <span class="timeline__category-text"></span>
            </div>
            <div class="timeline__years">
              <span class="timeline__year timeline__year--start"></span>
              <span class="timeline__year timeline__year--end"></span>
            </div>
            
            <div class="timeline__circle-wrapper">
              <div class="timeline__circle">
                ${this.createCirclePointsHTML()}
              </div>
            </div>
          </div>
          
          <div class="timeline__bottom">
            <div class="timeline__navigation-section">
              <div class="timeline__navigation">
                <span class="timeline__counter">
                  <span class="timeline__counter-current">01</span>/<span class="timeline__counter-total">06</span>
                </span>
                <div class="timeline__nav-buttons">
                  <button class="timeline__nav-button timeline__nav-button--prev" type="button" aria-label="Предыдущий период">
                    <svg viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                  <button class="timeline__nav-button timeline__nav-button--next" type="button" aria-label="Следующий период">
                    <svg viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.50012 0.750001L7.75012 7L1.50012 13.25" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            ${this.createDotsHTML()}
            
            <div class="timeline__events-section">
              <div class="timeline__events">
                <div class="timeline__events-wrapper">
                  <div class="swiper timeline-swiper">
                    <div class="swiper-wrapper">
                      ${this.createEventsHTML()}
                    </div>
                  </div>
                  
                  <div class="timeline__swiper-nav">
                    <button class="timeline-swiper-button-prev" type="button" aria-label="Предыдущее событие">
                      <svg viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                    <button class="timeline-swiper-button-next" type="button" aria-label="Следующее событие">
                      <svg viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.50012 0.750001L7.75012 7L1.50012 13.25" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = timelineHTML;
  }

  private createCirclePointsHTML(): string {
    return this.config.periods.map((period, index) => `
      <button 
        class="timeline__point" 
        data-period="${index}"
        type="button"
        aria-label="Период ${period.title}"
      >
        <span class="timeline__point-number">${index + 1}</span>
      </button>
    `).join('');
  }

  private createDotsHTML(): string {
    return `
      <div class="timeline__dots">
        ${this.config.periods.map((_, index) => `
          <div class="timeline__dot" data-period="${index}"></div>
        `).join('')}
      </div>
    `;
  }

  private createEventsHTML(): string {
    return this.config.periods.map(period => 
      period.events.map(event => `
        <div class="swiper-slide timeline__event" data-period="${period.id}">
          <div class="timeline__event-year">${event.year}</div>
          <div class="timeline__event-content">
            <h3 class="timeline__event-title">${event.title}</h3>
            ${event.description ? `<p class="timeline__event-description">${event.description}</p>` : ''}
          </div>
        </div>
      `).join('')
    ).join('');
  }

  private calculateCirclePoints(): void {
    const circleRadius = this.config.circleRadius || 265;
    const center = { x: circleRadius, y: circleRadius };
    const radius = circleRadius - 28;
    const totalPoints = this.config.periods?.length || 0;
    
    this.circlePoints = (this.config.periods || []).map((period, index) => {
      const angle = (index * (360 / totalPoints) - 90) * (Math.PI / 180);
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      
      return {
        id: index,
        x,
        y,
        angle: angle * (180 / Math.PI),
        period
      };
    });
  }

  private initializeSwiper(): void {
    const swiperElement = this.container.querySelector('.timeline-swiper');
    if (!swiperElement) return;

    const isMobile = window.innerWidth <= 768;
    
    let swiperConfig;
    
    if (isMobile) {
      swiperConfig = {
        modules: [Navigation, Pagination, FreeMode],
        navigation: {
          nextEl: '.timeline-swiper-button-next',
          prevEl: '.timeline-swiper-button-prev',
        },
        spaceBetween: 16,
        slidesPerView: 1,
        centeredSlides: false,
        freeMode: false,
        resistance: true,
        resistanceRatio: 0.85,
        speed: 300,
        touchRatio: 1,
        threshold: 10,
        touchStartPreventDefault: false,
        allowTouchMove: true,
        simulateTouch: true,
        touchEventsTarget: 'container',
        passiveListeners: false,
      };
    } else {
      swiperConfig = {
        modules: [Navigation, Pagination, FreeMode],
        navigation: {
          nextEl: '.timeline-swiper-button-next',
          prevEl: '.timeline-swiper-button-prev',
        },
        spaceBetween: 25,
        slidesPerView: 'auto',
        freeMode: true,
        mousewheel: {
          forceToAxis: true,
        },
        ...this.config.swiperConfig
      };
    }

    this.swiper = new Swiper(swiperElement as HTMLElement, swiperConfig);
    
    console.log('Swiper initialized:', { isMobile, config: swiperConfig });
  }

  private setupEventListeners(): void {
    const prevBtn = this.container.querySelector('.timeline__nav-button--prev');
    const nextBtn = this.container.querySelector('.timeline__nav-button--next');
    
    prevBtn?.addEventListener('click', () => this.goToPrev());
    nextBtn?.addEventListener('click', () => this.goToNext());

    const points = this.container.querySelectorAll('.timeline__point');
    points.forEach((point, index) => {
      point.addEventListener('click', () => this.goToPeriod(index));
    });

    const dots = this.container.querySelectorAll('.timeline__dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToPeriod(index));
    });

    if (this.config.enableKeyboardNavigation) {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (this.isAnimating) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.goToPrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.goToNext();
        break;
    }
  }

  private handleResize(): void {
    setTimeout(() => {
      this.updateCirclePointsPositions();
      
      if (this.swiper) {
        this.swiper.destroy();
        this.initializeSwiper();
        this.showEventsForPeriod(this.currentPeriodIndex);
      }
    }, 100);
  }

  private setInitialState(): void {
    console.log('Setting initial state...');
    
    setTimeout(() => {
      this.updateCirclePointsPositions();
    }, 100);
    
    this.updateYearDisplay();
    this.updateCounter();
    this.updateActivePoint();
    this.updateCategoryLabel();
    this.showEventsForPeriod(this.currentPeriodIndex);
    
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const visibleEvents = this.container.querySelectorAll('.timeline__event--visible');
        console.log('Visible events on mobile:', visibleEvents.length);
        
        const years = this.container.querySelector('.timeline__years');
        console.log('Years element visibility:', years ? 'visible' : 'hidden');
        
        if (this.swiper) {
          console.log('Swiper slides count:', this.swiper.slides.length);
        }
      }, 200);
    }
  }

  private updateCirclePointsPositions(): void {
    const points = this.container.querySelectorAll('.timeline__point');
    const circle = this.container.querySelector('.timeline__circle') as HTMLElement;
    
    if (!circle) return;
    
    const circleRect = circle.getBoundingClientRect();
    const actualRadius = circleRect.width / 2;
    const pointRadius = actualRadius - 28;
    const totalPoints = this.config.periods?.length || 0;
    
    points.forEach((point, index) => {
      const angle = (index * (360 / totalPoints) - 90) * (Math.PI / 180);
      const x = actualRadius + pointRadius * Math.cos(angle);
      const y = actualRadius + pointRadius * Math.sin(angle);
      
      (point as HTMLElement).style.transform = `translate(${x - actualRadius}px, ${y - actualRadius}px)`;
      
      const pointNumber = point.querySelector('.timeline__point-number') as HTMLElement;
      if (pointNumber) {
        pointNumber.style.transform = `rotate(${-this.currentRotation}deg)`;
      }
    });
  }

  private updateYearDisplay(): void {
    const currentPeriod = this.config.periods?.[this.currentPeriodIndex];
    const startYearEl = this.container.querySelector('.timeline__year--start');
    const endYearEl = this.container.querySelector('.timeline__year--end');
    
    if (currentPeriod && startYearEl && endYearEl) {
      gsap.to([startYearEl, endYearEl], {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          startYearEl.textContent = currentPeriod.yearStart.toString();
          endYearEl.textContent = currentPeriod.yearEnd.toString();
          gsap.to([startYearEl, endYearEl], { opacity: 1, duration: 0.3 });
        }
      });
    }
  }

  private updateCounter(): void {
    const currentEl = this.container.querySelector('.timeline__counter-current');
    const totalEl = this.container.querySelector('.timeline__counter-total');
    const periodsLength = this.config.periods?.length || 0;
    
    if (currentEl) {
      currentEl.textContent = String(this.currentPeriodIndex + 1).padStart(2, '0');
    }
    if (totalEl) {
      totalEl.textContent = String(periodsLength).padStart(2, '0');
    }
  }

  private updateActivePoint(): void {
    const points = this.container.querySelectorAll('.timeline__point');
    points.forEach((point, index) => {
      point.classList.toggle('timeline__point--active', index === this.currentPeriodIndex);
    });

    const dots = this.container.querySelectorAll('.timeline__dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('timeline__dot--active', index === this.currentPeriodIndex);
    });
  }

  private updateCategoryLabel(): void {
    const currentPeriod = this.config.periods?.[this.currentPeriodIndex];
    const labelEl = this.container.querySelector('.timeline__category-text');
    
    if (currentPeriod && labelEl) {
      gsap.to(labelEl, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          labelEl.textContent = currentPeriod.title;
          gsap.to(labelEl, { 
            opacity: 1, 
            y: 0, 
            duration: 0.3 
          });
        }
      });
    }
  }

  private showEventsForPeriod(periodIndex: number): void {
    const currentPeriod = this.config.periods?.[periodIndex];
    const allSlides = this.container.querySelectorAll('.timeline__event');
    
    console.log('showEventsForPeriod called:', { periodIndex, currentPeriod, totalSlides: allSlides.length });
    
    if (currentPeriod) {
      allSlides.forEach(slide => {
        const slidePeriodId = parseInt(slide.getAttribute('data-period') || '0');
        const shouldShow = slidePeriodId === currentPeriod.id;
        slide.classList.toggle('timeline__event--visible', shouldShow);
        
        console.log('Slide visibility:', { 
          slidePeriodId, 
          currentPeriodId: currentPeriod.id, 
          shouldShow,
          slideText: slide.querySelector('.timeline__event-title')?.textContent?.slice(0, 30)
        });
      });

      if (this.swiper) {
        setTimeout(() => {
          this.swiper?.update();
          this.swiper?.slideTo(0, 0);
          console.log('Swiper updated and moved to slide 0');
        }, 50);
      }
    }
  }

  private rotateCircle(targetAngle: number): void {
    const circle = this.container.querySelector('.timeline__circle');
    if (!circle) return;

    this.currentRotation = targetAngle;

    gsap.to(circle, {
      rotation: targetAngle,
      duration: this.config.animationDuration || 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        this.updateCirclePointsPositions();
      }
    });
  }

  public goToPeriod(index: number): void {
    const periodsLength = this.config.periods?.length || 0;
    if (this.isAnimating || index === this.currentPeriodIndex || index < 0 || index >= periodsLength) {
      return;
    }

    this.isAnimating = true;
    const oldIndex = this.currentPeriodIndex;
    this.currentPeriodIndex = index;

    const targetPosition = 120;
    const anglePerStep = 360 / periodsLength;
    const currentPointAngle = index * anglePerStep;
    
    const targetAngle = targetPosition - currentPointAngle;

    this.rotateCircle(targetAngle);
    this.updateYearDisplay();
    this.updateCounter();
    this.updateActivePoint();
    this.updateCategoryLabel();
    this.showEventsForPeriod(index);

    setTimeout(() => {
      this.isAnimating = false;
    }, (this.config.animationDuration || 0.8) * 1000);

    this.container.dispatchEvent(new CustomEvent('timeline:periodchange', {
      detail: {
        oldIndex,
        newIndex: index,
        period: this.config.periods?.[index]
      }
    }));
  }

  public goToNext(): void {
    const periodsLength = this.config.periods?.length || 0;
    const nextIndex = (this.currentPeriodIndex + 1) % periodsLength;
    this.goToPeriod(nextIndex);
  }

  public goToPrev(): void {
    const periodsLength = this.config.periods?.length || 0;
    const prevIndex = this.currentPeriodIndex === 0 ? periodsLength - 1 : this.currentPeriodIndex - 1;
    this.goToPeriod(prevIndex);
  }

  public getCurrentPeriod(): TimelinePeriod | undefined {
    return this.config.periods?.[this.currentPeriodIndex];
  }

  public getCurrentPeriodIndex(): number {
    return this.currentPeriodIndex;
  }

  public destroy(): void {
    if (this.config.enableKeyboardNavigation) {
      document.removeEventListener('keydown', this.handleKeydown.bind(this));
    }
    window.removeEventListener('resize', this.handleResize.bind(this));

    if (this.swiper) {
      this.swiper.destroy();
      this.swiper = null;
    }

    this.container.innerHTML = '';
  }
}