import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-successfull',
  templateUrl: './successfull.component.html',
  styleUrls: ['./successfull.component.scss']
})
export class SuccessfullComponent implements OnInit {

    fullname: string = '';
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.fullname = this.activatedRoute.snapshot.params['fullname'];
  }

}
