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

//==================КЛАСС КОМПОНЕНТА (ОТРИСОВКА)=======================
class Component {
    constructor(model) {    //===========Проверка на инстант класса Element======
        if (model instanceof Element) {
            this.model = model;
        } else {
            console.error('Error! Model is not an Element object');
        }
    }

    render() {}

}

//===========Дочерний класс для отрисовки любых компонентов=============
class TodoComponent extends Component{

    render() {

        const type = this.model.type;
        const props = this.model.props;
        const children = this.model.children;
        const attributes = this.model.attributes;

        let element;

        if (typeof type === 'string') {
            element = document.createElement(type);
        }

        for (let attrib in attributes) {
            element[attrib] = attributes[attrib];
        }

        if (typeof children === 'string') {
            element.innerText = children;
        } else if (children === null) {
            return null;
        } else if (typeof children === 'object') {
            const liComponents = children.map(elem => new TodoComponent(elem));
            liComponents.forEach(elem => element.appendChild(elem.render()));
        }

        return element;
    }
}