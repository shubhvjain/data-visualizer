import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'json-form',
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.css']
})
export class JsonFormComponent implements OnChanges {

  @Input() schema: [];
  @Input() action;
  @Input() data;

  @Output() onAddData = new EventEmitter<any>();

  defaultValues = {
    'number': 0,
    'string': '',
    'boolean': true,
    'arrayString': [],
  }

  constructor() {
    this.schema = [];
    this.action = "Plot"
    this.data = {}
  }

  ngOnInit() {
  }

  initData() {
    // console.log("initing data")
    if (this.action == 'new') {
      this.schema.map(itm => {
        let initValue = itm['default'] ? itm['default'] : this.defaultValues[itm['type']]
        this.data[itm['name']] = initValue
      })
      console.log(this.data)
    }
    this.valError.errorExists = false;
    //else if (this.action == 'edit') {
    //}
  }


  ngOnChanges(sm: SimpleChanges) {
    if (sm.schema) {
      this.schema = sm.schema.currentValue
      this.initData()
    }
    if (sm.action) {
      this.action = sm.action.currentValue;
      this.initData()


    }
  }

  validateData(schema, data) {
    let validators = {
      'number': (schema1, val) => {
        if (schema1['slider']) {
          val = parseInt(val)
        }

        let checks = {
          'minimum': (schemaVal, val) => {
            return val > schemaVal
          },
          'exclusiveMaximum': (schemaVal, val) => {
            return val < schemaVal
          },
          'required': (schemaVal, val) => {
            if (schemaVal == true) {
              if (!val) { return false } else { return true }
            } else if (schemaVal == false) {
              return true;
            }
          }
        }
        let err = [];
        Object.keys(schema1).map(itm => {
          if (checks[itm]) {
            if (checks[itm](schema1[itm], val) == false) {
              err.push(itm)
            }
          }
        })
        return err
      },

    }

    let errors = {}
    let errorExists = false;
    schema.map(itm => {
      if (itm['type'] == 'number') {
        let err = validators[itm['type']](itm, data[itm['name']])
        if (err.length > 0) {
          errorExists = true;
          errors[itm['name']] = err;
        }
      }
    })

    return { errors: errors, errorExists: errorExists, ky: Object.keys(errors) };
    // console.log(err)

  }
  valError = { errors: {}, errorExists: false, ky: [] }
  addNew() {
    // console.log(this.data)

    this.valError = this.validateData(this.schema, this.data)
    console.log(this.valError)
    if (this.valError.errorExists == false) {
      this.onAddData.emit({ data: this.data })
      if (this.action == 'new') {
        this.initData();
      }
    }

  }

}
