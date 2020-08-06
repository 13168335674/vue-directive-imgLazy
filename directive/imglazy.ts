import { Vue } from "vue-property-decorator";
import { DirectiveOptions } from "vue";

interface ICustomHTMLImageElement extends HTMLImageElement {
  isLoaded?: boolean;
  data_src?: string;
}

class LazyLoadImg {
  public observer: null | IntersectionObserver;
  private baseImg: string;
  constructor() {
    this.observer = null;
    this.baseImg = "http://hailuo.pro/loading.svg";
    this.init();
  }
  init() {
    this.observer = new IntersectionObserver(this.callback.bind(this));
  }
  callback(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entrie) => {
      if (entrie.isIntersecting) {
        const target = entrie.target as ICustomHTMLImageElement;
        !target.isLoaded && this.showImage(target, target.data_src);
      }
    });
  }
  handleObserve(el: ICustomHTMLImageElement, src: string) {
    el.src = this.baseImg;
    el.data_src = src;
    this.observer?.observe(el);
  }
  canclObserve(el: ICustomHTMLImageElement) {
    this.observer?.unobserve(el);
  }
  showImage(el: ICustomHTMLImageElement, imgSrc: string = this.baseImg) {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      el.src = imgSrc;
      el.isLoaded = true;
    };
  }
}
const LazyLoadImgIns = new LazyLoadImg();

Vue.directive("imgLazy", {
  inserted(el, binding) {
    const src = binding.value;
    LazyLoadImgIns.handleObserve(el as HTMLImageElement, src);
  },
  unbind() {
    LazyLoadImgIns?.observer?.disconnect();
  }
});

// export const imgLazy: DirectiveOptions = {
//   inserted(el, binding) {
//     const src = binding.value;
//     LazyLoadImgIns.handleObserve(el as HTMLImageElement, src);
//   },
//   unbind() {
//     LazyLoadImgIns?.observer?.disconnect();
//   },
// };
