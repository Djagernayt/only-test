import { TimelinePeriod, TimelineConfig } from '../types/timeline.types';

export const timelineData: TimelinePeriod[] = [
  {
    id: 1,
    title: 'Технологии',
    yearStart: 2015,
    yearEnd: 2022,
    events: [
      { year: 2015, title: '13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды' },
      { year: 2016, title: 'Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11' },
      { year: 2017, title: 'Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi' },
      { year: 2018, title: 'Запуск космического корабля SpaceX Crew Dragon' },
      { year: 2019, title: 'Первая фотография черной дыры в галактике M87' }
    ]
  },
  {
    id: 2,
    title: 'Наука',
    yearStart: 1990,
    yearEnd: 2010,
    events: [
      { year: 1991, title: 'Запуск космического телескопа Хаббл' },
      { year: 1997, title: 'Клонирование овцы Долли' },
      { year: 2003, title: 'Завершение проекта «Геном человека»' },
      { year: 2008, title: 'Запуск Большого адронного коллайдера' }
    ]
  },
  {
    id: 3,
    title: 'Искусство',
    yearStart: 1960,
    yearEnd: 1989,
    events: [
      { year: 1969, title: 'Вудстокский фестиваль' },
      { year: 1975, title: 'Выход фильма «Челюсти» Стивена Спилберга' },
      { year: 1977, title: 'Премьера «Звездных войн»' },
      { year: 1982, title: 'Выход альбома «Thriller» Майкла Джексона' }
    ]
  },
  {
    id: 4,
    title: 'История',
    yearStart: 1945,
    yearEnd: 1959,
    events: [
      { year: 1945, title: 'Окончание Второй мировой войны' },
      { year: 1949, title: 'Образование НАТО' },
      { year: 1957, title: 'Запуск первого искусственного спутника Земли' },
      { year: 1958, title: 'Создание NASA' }
    ]
  },
  {
    id: 5,
    title: 'Литература',
    yearStart: 1920,
    yearEnd: 1944,
    events: [
      { year: 1925, title: 'Публикация романа «Великий Гэтсби»' },
      { year: 1936, title: 'Выход романа «Унесенные ветром»' },
      { year: 1937, title: 'Публикация «Хоббита» Дж. Р. Р. Толкина' },
      { year: 1943, title: 'Выход «Маленького принца»' }
    ]
  },
  {
    id: 6,
    title: 'Спорт',
    yearStart: 1896,
    yearEnd: 1919,
    events: [
      { year: 1896, title: 'Первые современные Олимпийские игры в Афинах' },
      { year: 1903, title: 'Первая велогонка Тур де Франс' },
      { year: 1911, title: 'Первый Индианаполис 500' },
      { year: 1916, title: 'Основание PGA of America' }
    ]
  }
];

export const defaultConfig: Partial<TimelineConfig> = {
  initialPeriod: 0, 
  circleRadius: 265, 
  animationDuration: 0.8,
  enableKeyboardNavigation: true,
  swiperConfig: {
    navigation: {
      nextEl: '.timeline-swiper-button-next',
      prevEl: '.timeline-swiper-button-prev',
    },
    spaceBetween: 25,
    slidesPerView: 'auto',
    freeMode: {
      enabled: true,
      sticky: false,
    },
    mousewheel: {
      forceToAxis: true,
    },
    touchRatio: 1,
    threshold: 10,
    longSwipesRatio: 0.1,
    longSwipesMs: 300,
  }
};