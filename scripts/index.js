//================Срисок атрибутов для элементов=============
const attrFields = ['id', 'htmlFor', 'className', 'checked', 'type',
    'textContent', 'innerText', 'placeholder', 'onclick'];

//==================КЛАСС ЭЛЕМЕНТА==================
class Element {
    constructor(type, props, children) {

        this.type = type;
        this.props = {};

        //===Сортировка (атрибут / мусор)======
        let arr = {};
        for (let attr_el in props) {
            if (attrFields.indexOf(attr_el) !== -1) {
                arr[attr_el] = props[attr_el];
            } else {
                this.props[attr_el] = props[attr_el];
            }
        }
        //=========================================

        this.attributes = arr;
        this.children = children;
    }
}