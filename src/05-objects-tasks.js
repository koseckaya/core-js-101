/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const data = JSON.parse(json);
  const obj = Object.create(proto);

  Object.assign(obj, data);

  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
// const cssSelectorBuilder = {
//   cl: [],
//   att: [],
//   pseudoCl: [],
//   combineS: null,

//   getInstanceCopy() {
//     const newCopy = { ...this };

//     newCopy.clear();

//     return newCopy;
//   },

//   element(value) {
//     this.elem = value;
//     return this.getInstanceCopy();
//   },

//   id(value) {
//     this.ident = value;
//     return this.getInstanceCopy();
//   },

//   class(value) {
//     this.cl.push(value);
//     return this.getInstanceCopy();
//   },
//   attr(value) {
//     this.att.push(value);
//     return this.getInstanceCopy();
//   },
//   pseudoClass(value) {
//     this.pseudoCl.push(value);
//     return this.getInstanceCopy();
//   },

//   pseudoElement(value) {
//     this.pseudoEl = value;
//     return this.getInstanceCopy();
//   },


//   stringify() {
//     if (this.combineS !== null) {
//       this.clear();

//       return this.combineS;
//     }

//     const id = this.ident ? `#${this.ident}` : '';
//     const elem = this.elem ? `${this.elem}` : '';
//     let clas = '';
//     if (this.cl.length) {
//       clas = `.${this.cl.join('.')}`;
//     }
//     let att = '';
//     if (this.att.length) {
//       att = `${this.att.map((el) => `[${el}]`).join('')}`;
//     }
//     let pseudoCl = '';
//     if (this.pseudoCl.length) {
//       pseudoCl = `:${this.pseudoCl.join(':')}`;
//     }
//     const pseudoElem = this.pseudoEl ? `::${this.pseudoEl}` : '';

//     const result = elem + id + clas + att + pseudoCl + pseudoElem;
//     this.clear();
//     return result;
//   },

//   combine(selector1, combinator, selector2) {
//     this.combineS = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
//     return this.getInstanceCopy();
//   },

//   clear() {
//     this.ident = null;
//     this.elem = null;
//     this.cl = [];
//     this.att = [];
//     this.pseudoEl = null;
//     this.pseudoCl = [];

//     this.combineS = null;
//   },
// };
function BaseCombiner(selector1, combiner, selector2) {
  this.selector1 = selector1;
  this.combiner = combiner;
  this.selector2 = selector2;
  this.stringify = () => `${this.selector1.stringify()} ${this.combiner} ${this.selector2.stringify()}`;
}

class BaseSelector {
  constructor({
    element = '',
    id = '',
    className = '',
    attr = '',
    pseudoClass = '',
    pseudoElement = '',
  }) {
    this.el_element = '';
    this.el_id = '';
    this.el_class = [];
    this.el_attr = [];
    this.el_pseudoClass = [];
    this.el_pseudoElement = '';

    if (element.length) this.element(element);
    if (id.length) this.id(id);
    if (className.length) this.class(className);
    if (attr.length) this.attr(attr);
    if (pseudoClass.length) this.pseudoClass(pseudoClass);
    if (pseudoElement.length) this.pseudoElement(pseudoElement);
  }

  checkOrder(order) {
    if (this.callOrder > order) {
      BaseSelector.throwOrder();
    }

    this.callOrder = order;
  }

  element(value) {
    if (this.el_element.length) {
      return BaseSelector.throwUnique();
    }
    this.checkOrder(1);
    this.el_element = value;
    return this;
  }

  id(value) {
    if (this.el_id.length) {
      return BaseSelector.throwUnique();
    }
    this.checkOrder(2);
    this.el_id = value;
    return this;
  }

  class(value) {
    this.checkOrder(3);
    this.el_class.push(value);
    return this;
  }

  attr(value) {
    this.checkOrder(4);
    this.el_attr.push(value);
    return this;
  }

  pseudoClass(value) {
    this.checkOrder(5);
    this.el_pseudoClass.push(value);
    return this;
  }

  pseudoElement(value) {
    if (this.el_pseudoElement.length) {
      return BaseSelector.throwUnique();
    }
    this.checkOrder(6);
    this.el_pseudoElement = value;
    return this;
  }

  static throwOrder() {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }

  static throwUnique() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  printElement() {
    return `${this.el_element}`;
  }

  printId() {
    return this.el_id.length ? `#${this.el_id}` : '';
  }

  printClass() {
    return this.el_class.length ? `.${this.el_class.join('.')}` : '';
  }

  printAttr() {
    return this.el_attr.map((el) => `[${el}]`).join('');
  }

  printPseudoClass() {
    return this.el_pseudoClass.length ? `:${this.el_pseudoClass.join(':')}` : '';
  }

  printPseudoElement() {
    return this.el_pseudoElement.length ? `::${this.el_pseudoElement}` : '';
  }

  stringify() {
    return this.printElement() + this.printId() + this.printClass()
      + this.printAttr() + this.printPseudoClass() + this.printPseudoElement();
  }
}

const cssSelectorBuilder = {
  element: (value) => new BaseSelector({
    element: value,
  }),

  id: (value) => new BaseSelector({
    id: value,
  }),

  class: (value) => new BaseSelector({
    className: value,
  }),

  attr: (value) => new BaseSelector({
    attr: value,
  }),

  pseudoClass: (value) => new BaseSelector({
    pseudoClass: value,
  }),

  pseudoElement: (value) => new BaseSelector({
    pseudoElement: value,
  }),

  combine: (selector1, combiner, selector2) => new BaseCombiner(selector1, combiner, selector2),
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
