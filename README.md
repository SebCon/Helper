# Helper
light library for frequently used functionalities



# Helper
light library for basic functionalities

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

Download the file EventHandler.js and link them in your project like:
```html
<script src="Helper.js"></script>
```
or without downloading files like
```html
<script src="https://rawgit.com/SebCon/Helper/master/Helper.js"></script>
```

## some Examples

### test if integer

If you want to test if a value of any type is an integer, you can use the function *isInteger*:


```javascript
var intStr = '123';
var intNumber = 123;
var intError = '123a';

console.log(Helper.isInteger(intStr));      // true
console.log(Helper.isInteger(intNumber));   // true
console.log(Helper.isInteger(intError));    // false


```


### create random Identifier
Sometimes you need an generator for creating identifier, so you can use this function:

```javascript
var idOnlyChar = Helper.createRandomId({ len : 2, chars : 'Aa' });      // creating id of two upper and/or lower characters
var idOnlyNumbers = Helper.createRandomId({ len : 10, chars : '#' });   // creating id of ten numbers
var idCharNumbers = Helper.createRandomId({ chars : 'Aa#' });           // creating id of five upper and/or lower characters and numbers
var idOnlySpecial = Helper.createRandomId({ len : 5, chars : '!' });    // creating id of five special characters
```
      

## Authors

* **Sebastian Conrad** - [sebcon](http://www.sebcon.de)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

