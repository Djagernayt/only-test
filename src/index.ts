import './styles/globals.scss';
import Timeline from './components/Timeline';
import { timelineData, defaultConfig } from './data/timeline-data';
import { TimelineConfig } from './types/timeline.types';

class App {
  private timeline: Timeline | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.onDOMContentLoaded.bind(this));
    } else {
      this.onDOMContentLoaded();
    }
  }

  private onDOMContentLoaded(): void {
    const appContainer = document.getElementById('app');
    
    if (!appContainer) {
      console.error('Контейнер #app не найден');
      return;
    }

    this.initializeTimeline(appContainer);
    this.setupMultipleInstancesDemo();
    this.setupErrorHandling();
  }

  private initializeTimeline(container: HTMLElement): void {
    try {
      const config: Partial<TimelineConfig> = {
        ...defaultConfig,
        periods: timelineData,
        enableKeyboardNavigation: true
      };

      this.timeline = new Timeline(container, config);
      console.log('Timeline успешно инициализирован');
      
    } catch (error) {
      console.error('Ошибка при инициализации Timeline:', error);
      this.showErrorMessage(container);
    }
  }

  private setupMultipleInstancesDemo(): void {
    (window as any).createNewTimelineInstance = () => {
      const newContainer = document.createElement('div');
      newContainer.style.marginTop = '2rem';
      document.body.appendChild(newContainer);

      const newTimeline = new Timeline(newContainer, {
        periods: timelineData,
        initialPeriod: 0,
        enableKeyboardNavigation: false
      });

      console.log('Создан новый экземпляр Timeline');
      return newTimeline;
    };

    // console.log('💡 Для создания нового экземпляра выполните: window.createNewTimelineInstance()');
  }

  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      console.error('Глобальная ошибка:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Необработанное отклонение Promise:', event.reason);
    });
  }

  private showErrorMessage(container: HTMLElement): void {
    container.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        color: #42567A;
      ">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Ошибка загрузки</h1>
          <p style="font-size: 1.1rem; margin-bottom: 1rem;">
            Не удалось инициализировать компонент Timeline
          </p>
          <button 
            onclick="location.reload()" 
            style="
              background: #3877EE;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              font-size: 1rem;
              cursor: pointer;
            "
          >
            Обновить страницу
          </button>
        </div>
      </div>
    `;
  }

  public getTimeline(): Timeline | null {
    return this.timeline;
  }

  public destroy(): void {
    if (this.timeline) {
      this.timeline.destroy();
      this.timeline = null;
    }
  }
}

const app = new App();
export default app;
(window as any).timelineApp = app;

// console.log(`
// 🕰️ Timeline Project
// ├── Версия: 1.0.0
// ├── Технологии: TypeScript, SCSS, Webpack, Swiper, GSAP
// ├── Компонент: window.timelineApp.getTimeline()
// └── API: goToNext(), goToPrev(), goToPeriod(index)

// Для создания нового экземпляра: window.createNewTimelineInstance()
// `);