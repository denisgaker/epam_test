/*
Файл скачан с сервера и залит обратно с текущим комментарием.

При закрытии модального окна кликом на крестик в правом верхнем углу данные из полей формы и данные записанные в объект book не очищаются.
Таким образом, можно создавать книгу "По подобию":
    открыть форму редактирования книги-донора;
    закрыть форму кликом на крестик в правом верхнем углу;
    открыть форму добавления новой книги.
*/

book = {
    //МО ДЛЯ РЕДАКТИРОВАНИЯ
    edit: function()
    {
        book.elements.autor = event.target.parentElement.parentElement.parentElement.children[1].children[1].children[1].innerText; //Автор (из блока с книгой)
        book.elements.year  = event.target.parentElement.parentElement.parentElement.children[1].children[2].children[1].innerText; //Год издания (из блока с книгой)
        book.elements.img   = event.target.parentElement.parentElement.parentElement.children[0].children[0].getAttribute("src");   //Ссылка на изображение (из блока с книгой)
        book.elements.name  = event.target.parentElement.parentElement.parentElement.children[1].children[0].innerText;             //Название (из блока с книгой)
        book.parent         = event.target.parentElement.parentElement.parentElement;                                               //Ссылка на блок с книгой, откуда произошёл вызов модального окна
        
        for(let key in book.elements)
            document.getElementById(key).value = book.elements[key];    //Заполнение input МО данными по редактируемой книге

        document.getElementById("modal_wrap").classList.add("active");  //Отображение модального окна
    },
    //УДАЛЕНИЕ КНИГИ
    delete: function()
    {
        event.target.parentElement.parentElement.parentElement.remove();
    },
    //ДОБАВЛЕНИЕ НОВОЙ КНИГИ (отображение модального окна без значений в input)
    add: function()
    {
        document.getElementById("modal_wrap").classList.add("active");
    },
    //ФУНКЦИЯ СОХРАНЕНИЯ
    save: function()
    {
        //Добавление новой книги (если эл-т book.parent не записан)
        if (book.parent == false)
        {
            let newBook = document.createElement('div');    //Создание блока с разметкой и информацией для новой книги
            newBook.className = "book";
            newBook.innerHTML = '<div class="book_img">' + 
                                    '<img ' + 
                                    'src="' + document.getElementById("img").value + '"' +                  //Ссылка на картинку для книги
                                    'alt="' + document.getElementById("autor").value + '. ' +               //Автор книги для атрибута "alt"
                                              document.getElementById("name").value + ' (' +                //Название книги для атрибута "alt"
                                              document.getElementById("year").value + ')' + '">' +          //Год издания книги для атрибута "alt" | КОНЕЦ стрибута "alt" и тега "img"
                                '</div>' + 
                                '<div class="book_desc">' + 
                                    '<h2>' + document.getElementById("name").value + '</h2>' +              //Название книги
                                    '<p class="book_autor">' + 
                                        '<span class="meta">Автор: </span>' + 
                                        '<span>' + document.getElementById("autor").value + '</span>' +     //Автор книги
                                    '</p>' + 
                                    '<p class="book_year">' + 
                                        '<span class="meta">Год выпуска: </span>' + 
                                        '<span>' + document.getElementById("year").value + '</span>' +      //Год выпуска книги
                                    '</p>' + 
                                    '<div class="book_btn_wrapper">' + 
                                        '<button type="button" class="normal" data-type="edit" onclick="book.edit()">Редактировать</button>' + 
                                        '<button type="button" class="warning" data-type="delete" onclick="book.delete()">Удалить</button>' + 
                                    '</div>' + 
                                '</div>';

            document.getElementById("bookshelf").append(newBook);   //Запись блока с новой книгой в DOM
            book.cancel();                                          //Вызов ф-ции скрытия модального окна с очисткой полей
        }
        //Редактирование текущей книги (если эл-т book.parent записан)
        else
        {
            //Новые данные по книге (в том же порядке): название, автор, год издания, ссылка на изображение
            book.parent.querySelectorAll("h2")[0].innerText                                     = (document.getElementById("name").value !== "")  ? document.getElementById("name").value  : "Не указано";
            book.parent.querySelectorAll(".book_autor > span:not([class='meta'])")[0].innerText = (document.getElementById("autor").value !== "") ? document.getElementById("autor").value : "Не указан";
            book.parent.querySelectorAll(".book_year > span:not([class='meta'])")[0].innerText  = (document.getElementById("year").value !== "")  ? document.getElementById("year").value  : "Не указан";
            book.parent.querySelectorAll("img")[0].setAttribute("src", document.getElementById("img").value);
            
            book.cancel();  //Вызов ф-ции закрытия МО с очисткой "рабочих" данных из объекта и input
        }
    },
    //ФУНКЦИЯ ЗАКРЫТИЯ МО (клик на кнопку "Отмена")
    cancel: function()
    {
        let inputs = document.querySelectorAll("#modal_window input");      //Все input в модальном окне

        for (let i = 0; i < inputs.length; i++)                             //Очистка значений (value) всех input в модальном окне
            inputs[i].value = "";

        book.elements = {};                                                 //Удаление данных из объекта с информацией по книге
        book.parent = false;                                                //Удаление из объекта ссылки на блок, с которой произошёл вызов модального окна
        document.getElementById("modal_wrap").classList.remove("active");   //Скрытие модального окна и подложки
    },
    elements: {},   //Для хранения данных по существующей книге
    parent: false   //Для хранения инф-ции по блоку редактируемой книги
};

//ФУНКЦИЯ РАСПРЕДЕЛЕНИЯ СОБЫТИЙ НАЖАТИЯ НА КНОПКИ
function click_helper()
{
    let data_type = event.target.getAttribute("data-type");
    
    if (data_type === "edit")   book.edit();
    if (data_type === "delete") book.delete();
    if (data_type === "add")    book.add();
    if (data_type === "save") book.save();
}

//ФУНКЦИЯ ДОБАВЛЕНИЯ КНОПКАМ СОБЫТИЙ НАЖАТИЯ (click)
function add_listeners(event)
{
    if (event.type === "load")  //Если событие, инициализировавшее вызов ф-ции - событие загрузки страницы
    {
        let elements = document.querySelectorAll("button"); //Все кнопки на странице
        
        for (let e = 0; e < elements.length; e++)
            elements[e].onclick = click_helper;             //Вызов ф-ции распределения событий по кнопкам
        
        document.getElementById("cancel").onclick = book.cancel;    //Ф-ция для закрытия формы с очисткой полей и "рабочих" данных
        document.getElementById("md_close").addEventListener('click', () => document.getElementById("modal_wrap").classList.remove("active"));  //Закрытие формы по клику на крестик БЕЗ ОЧИСТКИ полей и "рабочих данных"
    }
}

//ЗАПУСК ПОСЛЕ ПОЛНОЙ ЗАГРУЗКИ DOM И СВЯЗАННЫХ ЭЛЕМЕНТОВ
window.onload = add_listeners;