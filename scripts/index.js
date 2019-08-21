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

//====================Выполнить задачу (пойдет как атрибут Чекбокса при нажатии)===================
function complete_task() {
    this.parentNode.classList.forEach(item => {  //==== По сути аналог toggleClass()  ====
        if (item === 'completed') {
            this.parentNode.classList.remove('completed');
        } else {
            this.parentNode.classList.add('completed');
        }
    });
    createCount_complete();  //====== Перерисовка счетчика выполненных задач
}

//====================СЧЕТЧИК ЗАДАЧ======================
function count() {
    return document.getElementsByClassName('task_item').length;  //===== Функция подсчета
}
function createCount() {  //=== Отрисовка результата подсчета

    const foot = new Element('span', {id: 'div_count'}, `Количество задач - ${count()}`);
    const foot_el = new TodoComponent(foot);
    while (document.getElementById('count').firstChild) {  //====== Затираем старые данные
        document.getElementById('count').removeChild(document.getElementById('count').firstChild)
    }
    document.getElementById('count').appendChild(foot_el.render());
}
//=============================================================

//====================СЧЕТЧИК ВЫПОЛНЕННЫХ ЗАДАЧ======================
function count_complete() {
    return document.getElementsByClassName('completed').length;  //===== Функция подсчета
}
function createCount_complete() {  //=== Отрисовка результата подсчета

    const foot = new Element('span', {id: 'div_count_complete'}, `Количество выполненных задач - ${count_complete()}`);
    const foot_el = new TodoComponent(foot);
    while (document.getElementById('count_complete').firstChild) {   //====== Затираем старые данные
        document.getElementById('count_complete').removeChild(document.getElementById('count_complete').firstChild)
    }
    document.getElementById('count_complete').appendChild(foot_el.render());
}
//=============================================================

//==============CLICK-Функция удаления задачи===(пойдет как атрибут кнопки)=========
function del_task() {
    this.parentNode.parentNode.removeChild(this.parentNode); //===Удаляет родителя нажатой кнопки
    createCount(); //===== Перерисовка счетчика задач
    createCount_complete(); //====== Перерисовка счетчика выполненных задач
}

//==============CLICK-Функция добавления задачи===(пойдет как атрибут кнопки)=========
function add_task () {
    const id = Math.random();

    const addItem = new Element('li', {className: 'task_item'}, [
        new Element('input', {type: 'checkbox', className: 'checkbox', id: id.toString(), onclick: complete_task},''),
        new Element('label', {htmlFor: id.toString()}, document.querySelector('#input1').value),
        new Element('button', {className: 'del_button', onclick: del_task}, 'Удалить')
    ]);

    const addItemEl = new TodoComponent(addItem);
    document.getElementById('ul1').appendChild(addItemEl.render());

    document.getElementById('input1').value = ''; //==== Очистка поля после ввода задачи

    createCount();  //===== Перерисовка счетчика задач
    createCount_complete(); //====== Перерисовка счетчика выполненных задач

}

//==============Функция для автоматизации создания и рендеринга элементов страницы=======
function createMyElement (type, props, children, target) {
    //Параметры - 1: Тип (строка), 2: атрибуты (объект)
    //            3: Дочерние элементы (массив объектов Element)
    //            4: Целевой элемент, в который будет рендериться наш объект (id ввиде строки)
    const element = new Element(type, props, children);
    const elementComponent = new TodoComponent(element);
    document.getElementById(target).appendChild(elementComponent.render());
}

//====================Главная функция=============================
//================================================================
//=================================================================

window.onload = function() {

    createCount(); //===== Перерисовка счетчика задач
    createCount_complete();  //===== Перерисовка счетчика выполненных задач

    // =======================Создаем инпут===============================
    createMyElement('input', {type: 'text', id: 'input1', placeholder: 'Введите задачу...'}, '', 'input_field');

    // =======================Создаем кнопку Добавить=======================
    createMyElement('button', {id: 'addButton', onclick: add_task}, 'Добавить', 'input_field');

    // =======================Создаем Список задач=======================
    createMyElement('ul', {id: 'ul1', className: 'list'}, '', 'tasks');

    // =======================Отлавливаем нажатие ENTER на поле ввода=======================
    document.getElementById('input_field').addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            add_task();
        }
    })
};