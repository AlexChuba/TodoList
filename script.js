'use strict';

(function Tod() {

    viewElems();

    document.addEventListener("click", remove__row);
    document.querySelector('.footer__clear-btn').addEventListener("click", Clear__footer);
    document.addEventListener("click", clearFooterHide);
    document.querySelector('.todoFilter__active').addEventListener("click", click__lineActive);
    document.querySelector('.todoFilter__complited').addEventListener("click", click__lineComplited);
    document.querySelector('.todoFilter__all').addEventListener("click", click__lineAll);
    document.addEventListener("click", check__inp);
    document.addEventListener("click", checkElementsComplited);
    document.addEventListener("click", checkElementsActive);
    document.addEventListener("click", counterTodos);
    document.addEventListener("change", editTextTodo);

    counterAfterRestart();
    showBtn();
    //element

    var itemsLength = document.querySelectorAll('.todo__elem').length;
    if (itemsLength > 0) {
        document.getElementsByClassName('footer')[0].style.display = 'flex';
    }

    document.querySelector('.new-todo').addEventListener('keydown', function (e) {

        if (e.keyCode === 13) {
            addElement();
            // add__line();
            this.value = '';
            var itemsLength = document.querySelectorAll('.todo__elem').length;
            if (itemsLength > 0) {
                document.getElementsByClassName('footer')[0].style.display = 'flex';
            }
            checkEnter__ElementsCompleted();
            checkEnter__ElementsActive();
            countItems();
        }
    });

})();

function showBtn() {
    var inp = document.querySelectorAll('.inp');
    var btn = document.querySelector('.footer__clear-btn');
    var count =0;
    for(var i=0; i<inp.length; i++){
        if(inp[i].checked){
            count++
        }
    }
    if(count>0){
        btn.classList.add('show__btn');
    }
    else{
        btn.classList.remove('show__btn');
    }

}

function checkFooter() {
    var itemsLength = document.getElementsByClassName('todo__elem').length;
    if (itemsLength === 0) {
        document.getElementsByClassName('footer')[0].style.display = 'none';
    }
}

function getStore() {
    let json = window.localStorage.getItem('todoList');
    return JSON.parse(json);
}

function setStore(value) {
    localStorage.setItem('todoList', JSON.stringify(value));
}

function viewElems() {
    document.getElementById('todo__list').innerHTML = '';
    let list = getStore();
    if (list) {
        list.forEach(function (items) {
            add__line(items);
        });

    }
}

function addElement() {
    let Store = getStore() || [];
    let globalInputValue = document.querySelector('.new-todo').value;
    if(globalInputValue.length>0){
        let item = {text: globalInputValue, check: false, id: Date.now()};
        Store.push(item);
    }

    setStore(Store);
    viewElems();

}

function add__line(item) {
    var checked = item['check'] ? 'checked' : '';
    document.getElementById('todo__list').insertAdjacentHTML('beforeend', '<li class="todo__elem"><div class="view"><input type="checkbox" ' + checked + ' class="inp" name=""><input class="text" id="' + item['id'] + '" value="' + item['text'] + '"><span class="destroy"></span></div></li>');
    sibblingOf('.footer__todoFilter > span', '.todoFilter__all');

}

function Clear__footer() {
        var removeGetStore = getStore();
        var store = [];
        for (let i = 0; i < removeGetStore.length; i++) {
            if (removeGetStore[i].check !== true) {
                store.push(removeGetStore[i])
            }
        }
        setStore(store);
        viewElems();
        checkFooter();
        showBtn();

}

function remove__row(event) {
    if (event.target.className === 'destroy') {
        var next = event.target.previousElementSibling;
        var nextId = next.id;
        var removeGetStore = getStore();
        for (var i = 0; i < removeGetStore.length; i++) {
            if (removeGetStore[i].id == nextId) {
                removeGetStore.splice(i, 1);
            }
        }
        setStore(removeGetStore);
        viewElems();
        checkFooter();
        // countItems();
    }
}

function check__inp(event) {
    if (event.target.className === 'inp') {
        var inp = document.querySelectorAll('.inp');
        var GetStore = getStore();
        for (var i = 0; i < inp.length && i < GetStore.length; i++) {
            if (inp[i].checked) {
                GetStore[i].check = true
            } else {
                GetStore[i].check = false
            }
        }
        setStore(GetStore);
    }
}

function editTextTodo(event) {
    if (event.target.className === 'text') {
        var todoText = document.querySelectorAll('.text');
        var GetStore = getStore();
        for (var i = 0; i < todoText.length && i < GetStore.length; i++) {
            console.log(todoText[i].value);
            GetStore[i].text = todoText[i].value;
        }
        setStore(GetStore);
    }
}

function sibblingOf(name) {
    var children = document.querySelectorAll(name);
    for (var i = 0; i < children.length; i++) {
        children[i].addEventListener("click", function () {
            for (var y = 0; y < children.length; y++) {
                children[y].classList.remove("active")
            }
            this.classList.add("active");

        }, false)
    }
}

function countItems() {
    var inp = document.querySelectorAll('.inp');
    let footerCount = document.querySelector('.footer__todoCount');
    var count =0;
    for(var i =0; i<inp.length; i++){
        if(!inp[i].checked){
            count++;
        }
    }

    footerCount.innerHTML = '' + count + ' items left';

}

function counterTodos(event) {
    if (event.target.className === 'inp') {
        var inp = document.querySelectorAll('.inp');
        var ln = 0;
        for (var x = 0; x < inp.length; x++) {
            if (inp[x].checked) {
                ln++;
            }
        }
        var elm = document.querySelectorAll('.todo__elem');
        let footerCount = document.getElementsByClassName('footer__todoCount')[0];
        let itemsLength = elm.length;
        footerCount.innerHTML = '' + itemsLength - ln + ' items left';
    }
}

function counterAfterRestart() {
    var inp = document.querySelectorAll('.inp');
    var count = 0;
    for (var x = 0; x < inp.length; x++) {
        if (!inp[x].checked) {
            count++;
        }
    }
    let footerCount = document.querySelector('.footer__todoCount');
    footerCount.innerHTML = '' + count + ' items left';

}

function clearFooterHide() {
    var inp = document.querySelectorAll('.inp');
    var btn = document.getElementsByClassName('footer__clear-btn')[0];
    inp.forEach(function (input) {
        input.onchange = function () {

            if (isCheckedInputs()) {
                btn.classList.add('show__btn');
            } else {
                btn.classList.remove('show__btn')
            }
        };
    });

    function isCheckedInputs() {
        var checkedArray = [];

        inp.forEach(function (input) {
            if (input.checked) {
                checkedArray.push(input)
            }
        });

        return checkedArray.length > 0;
    }
}

function click__lineActive() {
    var inp = document.querySelectorAll('.inp');
    for (let x = 0; x < inp.length; x++) {
        if (inp[x].checked) {
            inp[x].closest('.todo__elem').style.display = 'none';
        } else {
            inp[x].closest('.todo__elem').style.display = 'block';
        }
    }
}

function click__lineComplited() {
    var inp = document.querySelectorAll('.inp');
    for (let x = 0; x < inp.length; x++) {
        if (inp[x].checked) {
            inp[x].closest('.todo__elem').style.display = 'block';
        } else {
            inp[x].closest('.todo__elem').style.display = 'none';
        }
    }
}

function click__lineAll() {
    var inp = document.querySelectorAll('.inp');
    for (let x = 0; x < inp.length; x++) {
        inp[x].closest('.todo__elem').style.display = 'block';
    }
}

function checkEnter__ElementsCompleted() {
    var inp = document.querySelectorAll('.inp');
    var completed = document.querySelector('.todoFilter__complited');
    if (completed.classList.contains('active')) {
        inp.forEach(function (input) {
            if (!input.checked) {
                input.closest('.todo__elem').style.display = 'none';
            }
        })
    }
}

function checkEnter__ElementsActive() {
    var inp = document.querySelectorAll('.inp');
    var active = document.querySelector('.todoFilter__active');
    if (active.classList.contains('active')) {
        inp.forEach(function (input) {
            if (input.checked) {
                input.closest('.todo__elem').style.display = 'none';
            }
        })
    }
}

function checkElementsComplited(event) {
    if (event.target.className === 'inp') {
        var inp = document.querySelectorAll('.inp');
        var complited = document.querySelector('.todoFilter__complited');
        if (complited.classList.contains('active')) {
            inp.forEach(function (input) {
                if (!input.checked) {
                    input.closest('.todo__elem').style.display = 'none';
                }
            })
        }
    }
}

function checkElementsActive(event) {
    if (event.target.className === 'inp') {
        var inp = document.querySelectorAll('.inp');
        var complited = document.querySelector('.todoFilter__active');
        if (complited.classList.contains('active')) {
            inp.forEach(function (input) {
                if (input.checked) {
                    input.closest('.todo__elem').style.display = 'none';
                }
            })
        }
    }
}



