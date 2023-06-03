import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-typewriter',
  templateUrl: './typewriter.component.html',
  styleUrls: ['./typewriter.component.scss'],
})
export class TypewriterComponent implements OnInit {
  @Input() text!: string;
  @Input() speed = 100;
  animatedText = '';

  ngOnInit() {
    let i = 0;
    const intervalId = setInterval(() => {
      this.animatedText += this.text.charAt(i);
      i++;
      if (i > this.text.length) {
        clearInterval(intervalId);
      }
    }, this.speed);
  }
}
