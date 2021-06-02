const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector(`[data-new-list-form]`);
const newListInput = document.querySelector(`[data-new-list-input]`);
const delteListButton = document.querySelector(`[deta-delete-list-button]`);
const listDisplayContainer = document.querySelector(`[data-list-display-container]`);
const listTitleElement = document.querySelector(`[data-list-title]`);
const listCountElement = document.querySelector(`[data-list-count]`);
const tasksContainer = document.querySelector(`[data-tasks]`);
const taskTemplate = document.getElementById(`task-template`);

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener(`click`, e => {
    if(e.target.tagName.toLowerCase() === `li`) {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
})

delteListButton.addEventListener(`click`, e => {//delete button
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
})

newListForm.addEventListener(`submit`, e => {
    e.preventDefault();
    const listName = newListInput.value;
    if(listName == null || listName === ``) return ;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
})

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function saveAndRender() {
    save();
    render();
}

function createList(name) {
    return {id: Date.now().toString(), name: name, tasks: []}
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);
    if(selectedListId == null) {
        listDisplayContainer.style.display = `none`;
    }else {
        listDisplayContainer.style.display = ``;
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
};

function renderTasks(selectedList) {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector(`input`);
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector(`label`);
    label.htmlfor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
}

function renderTaskCount(selectedList) {
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTasksCount === 1 ? `task` : `tasks`;
    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`;
}

function renderLists(){
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add(`list-name`);
        listElement.innerText = list.name;
        if(list.id === selectedListId) listElement.classList.add(`active-list`);
        listsContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render()