import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.css']
})
export class DataSourceComponent implements OnInit {
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { 
        class: 'modal-lg',
        backdrop:true,
        ignoreBackdropClick	:true,
        animated:true,
        keyboard:false
      })
    );
  }
}
