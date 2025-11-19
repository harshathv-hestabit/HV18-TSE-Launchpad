function debounce(fn, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

function throttle(fn, limit = 200) {
    let inThrottle = false;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addTask");
const pendingList = document.getElementById("pendingTasksList");
const completedList = document.getElementById("completedTasksList");
const completedSection = document.querySelector(".completedTasks");
const pendingSection = document.querySelector(".pendingTasks");

const saveTasks = debounce(() => {
    try {
        localStorage.setItem("pendingTasks", pendingList.innerHTML);
        localStorage.setItem("completedTasks", completedList.innerHTML);
    } catch (err) {
        console.error("Error saving tasks:", err);
    }
}, 300);

function loadTasks() {
    try {
        pendingList.innerHTML = localStorage.getItem("pendingTasks") || "";
        completedList.innerHTML = localStorage.getItem("completedTasks") || "";

        pendingSection.style.display = pendingList.children.length ? "block" : "none";
        completedSection.style.display = completedList.children.length ? "block" : "none";

        attachEvents(pendingList);
        attachEvents(completedList);

    } catch (err) {
        console.error("Error loading tasks:", err);
    }
}

function addTask() {
    try {
        const text = input.value.trim();
        if (!text) throw new Error("Task names cannot be empty!");

        const li = createTaskElement(text);
        pendingList.appendChild(li);

        input.value = "";
        pendingSection.style.display = "block";

        saveTasks();
    } catch (err) {
        console.error("Error adding task:", err.message);
    }
}

function createTaskElement(text) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener(
        "change",
        throttle(() => toggleTask(checkbox), 150)
    );

    const span = document.createElement("span");
    span.textContent = text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("click", () => deleteTask(li));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

const toggleTask = throttle((checkbox) => {
    try {
        const li = checkbox.parentNode;

        if (checkbox.checked) {
            completedList.appendChild(li);
            completedSection.style.display = "block";
            if (!pendingList.children.length) pendingSection.style.display = "none";
        } else {
            pendingList.appendChild(li);
            pendingSection.style.display = "block";
            if (!completedList.children.length) completedSection.style.display = "none";
        }

        saveTasks();
    } catch (err) {
        console.error("Error toggling task:", err);
    }
}, 150);

function deleteTask(li) {
    try {
        const parent = li.parentNode;
        li.remove();

        if (parent === completedList && !completedList.children.length)
            completedSection.style.display = "none";

        if (parent === pendingList && !pendingList.children.length)
            pendingSection.style.display = "none";

        saveTasks();
    } catch (err) {
        console.error("Error deleting task:", err);
    }
}

function attachEvents(list) {
    Array.from(list.children).forEach((li) => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const deleteBtn = li.querySelector("button");

        if (checkbox)
            checkbox.addEventListener(
                "change",
                throttle(() => toggleTask(checkbox), 150)
            );

        if (deleteBtn) deleteBtn.addEventListener("click", () => deleteTask(li));
    });
}

addBtn.addEventListener("click", addTask);
loadTasks();
