import {Directive, Input, HostBinding, ElementRef} from "@angular/core";

@Directive({selector: '[collapse]'})
export class CollapseDirective {

  @HostBinding('class.collapsing')
  private isCollapsing: boolean;

  // style
  @HostBinding('style.height')
  private height:string;


  @Input()
  private set collapse(value:boolean) {
    if(value!==undefined){
      if(value){
        this.hide();
      }else {
        this.show();
      }
    }
  }

  constructor(public el: ElementRef) {
    this.measureHeight();
  }

  measureHeight() {
    let elem = this.el.nativeElement;
    //lets be sure the element has display:block style
    elem.className = elem.className.replace('collapse', '');
    this.height = elem.scrollHeight;

  }

  hide(){
    //this.height = this.height +'px';
    console.log("hide().height -> ", this.height);
    setTimeout(() => {
      this.height = '0px';
      this.isCollapsing = true;//apply 'collapsing' class
    },1);
  }

  show() {
    //this.height = '0px';
    console.log("show().height -> ", this.height);
    setTimeout(() => {
      this.height = this.height + 'px';
      this.isCollapsing = true;//apply 'collapsing' class
    },1);
  }
}
