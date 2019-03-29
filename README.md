# NgRison

This project is based with [angular-rison](https://github.com/JoshLipps/angular-rison).
It is an Angular module with a service for converting JavaScript structures into URL-friendly strings and vice versa

## Install
```
npm install git+https://github.com/artemishealth/ng-rison.git
```

## Usage
#### Module setup

```js
import { NgModule } from '@angular/core';
import { NgRisonModule } from 'ng-rison';

@NgModule({
    imports: [NgRisonModule]
})
export class MyModule {}
```
#### In a Component

```js
import { RisonService } from 'ng-rison'

@Component({
	// ...
})
export class FooComponent {
	constructor(private risonService: RisonService) {}
}
```

## API
#### Methods

* `parse(url:string): any` Parses a Rison URL string into a JavaScript object
* `stringify(object: any): string` Stringifies a JavaScript Object into a Rison string
